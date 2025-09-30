import jsPDF from 'jspdf';

export const generatePDFReport = async (reportData: any, aiReport: string, userName?: string) => {
  const pdf = new jsPDF();
  
  // Add Bridge logo with proper aspect ratio
  try {
    const logoImg = await loadImage('/bridge.png');
    // Maintain aspect ratio - adjust width/height as needed
    const logoWidth = 40;
    const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
    pdf.addImage(logoImg, 'PNG', 20, 20, logoWidth, logoHeight);
  } catch (error) {
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
  const summary = reportData.summary || {};
  const metrics = reportData.metrics || [];
  const year5Data = metrics[4] || {};
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const summaryText = [
    `Your hotel is projected to generate $${(summary.totalRevenue || year5Data.totalRevenue || 0).toLocaleString()} in Year 5 revenue,`,
    `which is above the national average for similar properties in your area.`,
    `This strong performance is driven by your ${(summary.occupancy || year5Data.occupancy || 0).toFixed(1)}% occupancy rate`,
    `and $${(summary.revpar || year5Data.revpar || 0).toFixed(0)} RevPAR, indicating healthy market demand and pricing power.`,
    ``,
    `Key highlights:`,
    `• Year 5 NOI: $${(summary.noi || year5Data.noi || 0).toLocaleString()}`,
    `• Occupancy Growth: ${(((summary.occupancy || year5Data.occupancy || 0) / 70 - 1) * 100).toFixed(1)}% over 5 years`,
    `• Revenue Growth: ${(((summary.totalRevenue || year5Data.totalRevenue || 0) / 4407375 - 1) * 100).toFixed(1)}% over 5 years`
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
  const cleanReport = aiReport.replace(/\*\*/g, '').replace(/\*/g, '').replace(/---/g, '');
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

const addFinancialTables = (pdf: jsPDF, reportData: any) => {
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
    ['Expense Growth Rate', `${reportData.assumptions.expenseGrowthRate}%`]
  ];
  
  let yPos = 40;
  assumptions.forEach(([label, value]) => {
    pdf.text(label, 20, yPos);
    pdf.text(value, 120, yPos);
    yPos += 10;
  });
  
  // Add 5-year projections table with better styling
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100); // Grey color
  pdf.text('5-Year Financial Projections', 20, yPos + 20);
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
  reportData.metrics.forEach((metric: any) => {
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
  
  const summary = reportData.summary || {};
  const metrics = reportData.metrics || [];
  const year5Data = metrics[4] || {};
  
  const kpiData = [
    ['Year 5 Total Revenue', `$${(summary.totalRevenue || year5Data.totalRevenue || 0).toLocaleString()}`],
    ['Year 5 NOI', `$${(summary.noi || year5Data.noi || 0).toLocaleString()}`],
    ['Year 5 Occupancy', `${(summary.occupancy || year5Data.occupancy || 0).toFixed(1)}%`],
    ['Year 5 RevPAR', `$${(summary.revpar || year5Data.revpar || 0).toFixed(0)}`],
    ['5-Year Revenue Growth', `${(((summary.totalRevenue || year5Data.totalRevenue || 0) / 4407375 - 1) * 100).toFixed(1)}%`],
    ['5-Year NOI Growth', `${(((summary.noi || year5Data.noi || 0) / 1322213 - 1) * 100).toFixed(1)}%`]
  ];
  
  yPos = dataY + 35;
  kpiData.forEach(([label, value]) => {
    pdf.text(label, 20, yPos);
    pdf.text(value, 120, yPos);
    yPos += 10;
  });
};
