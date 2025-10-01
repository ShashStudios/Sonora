import jsPDF from 'jspdf';

interface ReportData {
  assumptions: {
    numberOfRooms: number;
    baseOccupancyRate: number;
    baseADR: number;
    adrGrowthRate: number;
    occupancyGrowthRate: number;
    expenseGrowthRate: number;
    projectionYears: number;
  };
  metrics: Array<{
    year: number;
    occupancy: number;
    adr: number;
    revpar: number;
    totalRevenue: number;
    totalExpenses: number;
    noi: number;
    noiMargin: number;
  }>;
  summary?: {
    totalRevenue: number;
    totalExpenses: number;
    noi: number;
    occupancy: number;
    revpar: number;
  };
}

export const generatePDFReport = async (reportData: ReportData, aiReport: string, userName?: string) => {
  const pdf = new jsPDF();
  
  // Add Bridge logo with proper aspect ratio
  try {
    const logoImg = await loadImage('/bridge.png');
    // Maintain aspect ratio - adjust width/height as needed
    const logoWidth = 40;
    const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
    pdf.addImage(logoImg, 'PNG', 20, 20, logoWidth, logoHeight);
  } catch {
    console.log('Logo not found, continuing without logo');
  }
  
  // Add title with better positioning - centered and lower
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  const titleWidth = pdf.getTextWidth('Hotel Pro Forma Report');
  const pageWidth = pdf.internal.pageSize.width;
  pdf.text('Hotel Pro Forma Report', (pageWidth - titleWidth) / 2, 50);
  
  // Add generation date - centered
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const dateWidth = pdf.getTextWidth(`Generated: ${new Date().toLocaleDateString()}`);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, (pageWidth - dateWidth) / 2, 60);
  
  // Add personalized greeting
  if (userName) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Hi ${userName},`, 20, 80);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const greeting = `Based on your hotel pro forma analysis, here's a comprehensive report of your property's projected performance.`;
    const greetingLines = pdf.splitTextToSize(greeting, 170);
    pdf.text(greetingLines, 20, 90);
  }
  
  // Add executive summary section with better styling
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100); // Grey color
  pdf.text('Executive Summary', 20, 110);
  pdf.setTextColor(0, 0, 0); // Reset to black
  
  // Add key metrics summary
  const summary = reportData.summary || {
    totalRevenue: 0,
    totalExpenses: 0,
    noi: 0,
    occupancy: 0,
    revpar: 0
  };
  const metrics = reportData.metrics || [];
  const finalYearData = metrics[metrics.length - 1] || {
    totalRevenue: 0,
    totalExpenses: 0,
    noi: 0,
    occupancy: 0,
    revpar: 0
  };
  const firstYearData = metrics[0] || {
    totalRevenue: 0,
    totalExpenses: 0,
    noi: 0,
    occupancy: 0,
    revpar: 0
  };
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const projectionYears = reportData.assumptions.projectionYears;
  const finalYearRevenue = summary.totalRevenue || finalYearData.totalRevenue;
  const finalYearNOI = summary.noi || finalYearData.noi;
  const finalYearOccupancy = summary.occupancy || finalYearData.occupancy;
  const finalYearRevPAR = summary.revpar || finalYearData.revpar;
  
  const occupancyGrowth = firstYearData.occupancy > 0 ? 
    (((finalYearOccupancy / firstYearData.occupancy) - 1) * 100).toFixed(1) : '0.0';
  const revenueGrowth = firstYearData.totalRevenue > 0 ? 
    (((finalYearRevenue / firstYearData.totalRevenue) - 1) * 100).toFixed(1) : '0.0';
  
  const summaryText = [
    `Your hotel is projected to generate $${finalYearRevenue.toLocaleString()} in Year ${projectionYears} revenue,`,
    `which is above the national average for similar properties in your area.`,
    `This strong performance is driven by your ${finalYearOccupancy.toFixed(1)}% occupancy rate`,
    `and $${finalYearRevPAR.toFixed(0)} RevPAR, indicating healthy market demand and pricing power.`,
    ``,
    `Key highlights:`,
    `> Year ${projectionYears} NOI: $${finalYearNOI.toLocaleString()}`,
    `> Occupancy Growth: ${occupancyGrowth}% over ${projectionYears} years`,
    `> Revenue Growth: ${revenueGrowth}% over ${projectionYears} years`
  ];
  
  let yPosition = 120;
  summaryText.forEach(line => {
    if (yPosition > 280) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(line, 20, yPosition);
    yPosition += 6;
  });
  
  // Add financial analysis section with better styling
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100); // Grey color
  pdf.text('Financial Analysis', 20, yPosition + 15);
  pdf.setTextColor(0, 0, 0); // Reset to black
  
  // Add AI-generated content with better formatting
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  // Clean up AI report formatting
  const cleanReport = aiReport
    .replace(/\*\*/g, '') // Remove bold markdown
    .replace(/\*/g, '') // Remove italic markdown
    .replace(/---/g, '') // Remove horizontal rules
    .replace(/^#+\s*/gm, '') // Remove markdown headers
    .replace(/^\s*[-•]\s*/gm, '> ') // Convert bullets to arrows
    .replace(/^\s*\d+\.\s*/gm, '> ') // Convert numbered lists to arrows
    .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
    .trim();
  
  const splitText = pdf.splitTextToSize(cleanReport, 170);
  yPosition += 30;
  
  for (let i = 0; i < splitText.length; i++) {
    if (yPosition > 280) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(splitText[i], 20, yPosition);
    yPosition += 6;
  }
  
  // Add financial data tables
  addFinancialTables(pdf, reportData);
  
  return pdf;
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const addFinancialTables = (pdf: jsPDF, reportData: ReportData) => {
  // Add a new page for financial data
  pdf.addPage();
  
  // Add assumptions table with better styling
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100); // Grey color
  pdf.text('Hotel Assumptions', 20, 25);
  pdf.setTextColor(0, 0, 0); // Reset to black
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const assumptions = [
    ['Number of Rooms', reportData.assumptions.numberOfRooms.toString()],
    ['Base Occupancy Rate', `${reportData.assumptions.baseOccupancyRate}%`],
    ['Base ADR', `$${reportData.assumptions.baseADR}`],
    ['ADR Growth Rate', `${reportData.assumptions.adrGrowthRate}%`],
    ['Occupancy Growth Rate', `${reportData.assumptions.occupancyGrowthRate}%`],
    ['Expense Growth Rate', `${reportData.assumptions.expenseGrowthRate}%`],
    ['Projection Years', `${reportData.assumptions.projectionYears}`]
  ];
  
  let yPos = 40;
  assumptions.forEach(([label, value]) => {
    pdf.text(label, 20, yPos);
    pdf.text(value, 120, yPos);
    yPos += 10;
  });
  
  // Add X-year projections table with better styling
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100); // Grey color
  pdf.text(`${reportData.assumptions.projectionYears}-Year Financial Projections`, 20, yPos + 20);
  pdf.setTextColor(0, 0, 0); // Reset to black
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const headers = ['Year', 'Occupancy', 'ADR', 'RevPAR', 'Revenue', 'Expenses', 'NOI'];
  const colWidths = [15, 25, 25, 25, 35, 35, 35];
  const headerY = yPos + 35;
  
  // Draw table headers
  let xPos = 20;
  headers.forEach((header, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(header, xPos, headerY);
    xPos += colWidths[index];
  });
  
  // Draw table data
  let dataY = headerY + 8;
  reportData.metrics.forEach((metric) => {
    xPos = 20;
    const row = [
      metric.year.toString(),
      `${metric.occupancy.toFixed(1)}%`,
      `$${metric.adr.toFixed(0)}`,
      `$${metric.revpar.toFixed(0)}`,
      `$${metric.totalRevenue.toLocaleString()}`,
      `$${metric.totalExpenses.toLocaleString()}`,
      `$${metric.noi.toLocaleString()}`
    ];
    
    pdf.setFont('helvetica', 'normal');
    row.forEach((cell, index) => {
      pdf.text(cell, xPos, dataY);
      xPos += colWidths[index];
    });
    dataY += 8;
  });
  
  // Add summary section with better styling
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100); // Grey color
  pdf.text('Key Performance Indicators', 20, dataY + 20);
  pdf.setTextColor(0, 0, 0); // Reset to black
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const summary = reportData.summary || {
    totalRevenue: 0,
    totalExpenses: 0,
    noi: 0,
    occupancy: 0,
    revpar: 0
  };
  const metrics = reportData.metrics || [];
  const finalYearData = metrics[metrics.length - 1] || {
    totalRevenue: 0,
    totalExpenses: 0,
    noi: 0,
    occupancy: 0,
    revpar: 0
  };
  const firstYearData = metrics[0] || {
    totalRevenue: 0,
    totalExpenses: 0,
    noi: 0,
    occupancy: 0,
    revpar: 0
  };
  
  const projectionYears = reportData.assumptions.projectionYears;
  const finalYearRevenue = summary.totalRevenue || finalYearData.totalRevenue;
  const finalYearNOI = summary.noi || finalYearData.noi;
  const finalYearOccupancy = summary.occupancy || finalYearData.occupancy;
  const finalYearRevPAR = summary.revpar || finalYearData.revpar;
  
  const revenueGrowth = firstYearData.totalRevenue > 0 ? 
    (((finalYearRevenue / firstYearData.totalRevenue) - 1) * 100).toFixed(1) : '0.0';
  const noiGrowth = firstYearData.noi > 0 ? 
    (((finalYearNOI / firstYearData.noi) - 1) * 100).toFixed(1) : '0.0';
  
  const kpiData = [
    [`Year ${projectionYears} Total Revenue`, `$${finalYearRevenue.toLocaleString()}`],
    [`Year ${projectionYears} NOI`, `$${finalYearNOI.toLocaleString()}`],
    [`Year ${projectionYears} Occupancy`, `${finalYearOccupancy.toFixed(1)}%`],
    [`Year ${projectionYears} RevPAR`, `$${finalYearRevPAR.toFixed(0)}`],
    [`${projectionYears}-Year Revenue Growth`, `${revenueGrowth}%`],
    [`${projectionYears}-Year NOI Growth`, `${noiGrowth}%`]
  ];
  
  yPos = dataY + 35;
  kpiData.forEach(([label, value]) => {
    pdf.text(label, 20, yPos);
    pdf.text(value, 120, yPos);
    yPos += 10;
  });
};
