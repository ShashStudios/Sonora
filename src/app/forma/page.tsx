"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { 
  Download, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Info
} from "lucide-react";

interface HotelAssumptions {
  numberOfRooms: number;
  baseOccupancyRate: number;
  baseADR: number;
  adrGrowthRate: number;
  occupancyGrowthRate: number;
  expenseGrowthRate: number;
  projectionYears: number;
}

interface ValidationErrors {
  numberOfRooms?: string;
  baseOccupancyRate?: string;
  baseADR?: string;
  adrGrowthRate?: string;
  occupancyGrowthRate?: string;
  expenseGrowthRate?: string;
  projectionYears?: string;
}

interface FinancialMetrics {
  year: number;
  occupancy: number;
  adr: number;
  revpar: number;
  occupiedRooms: number;
  roomsRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
  payroll: number;
  utilities: number;
  marketing: number;
  maintenance: number;
  otherExpenses: number;
  totalExpenses: number;
  noi: number;
  noiMargin: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Chart configuration for shadcn/ui charts
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#10B981",
  },
  expenses: {
    label: "Expenses", 
    color: "#EF4444",
  },
  noi: {
    label: "NOI",
    color: "#3B82F6",
  },
  revpar: {
    label: "RevPAR",
    color: "#8B5CF6",
  },
  occupancy: {
    label: "Occupancy",
    color: "#F59E0B",
  },
} satisfies ChartConfig;

export default function FormaPage() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  const [assumptions, setAssumptions] = useState<HotelAssumptions>({
    numberOfRooms: 100,
    baseOccupancyRate: 70,
    baseADR: 150,
    adrGrowthRate: 3,
    occupancyGrowthRate: 2,
    expenseGrowthRate: 2.5,
    projectionYears: 5,
  });

  const [metrics, setMetrics] = useState<FinancialMetrics[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'expenses' | 'profitability'>('overview');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const calculateMetrics = useCallback(() => {
    const newMetrics: FinancialMetrics[] = [];
    
    for (let year = 1; year <= assumptions.projectionYears; year++) {
      const occupancy = assumptions.baseOccupancyRate * Math.pow(1 + assumptions.occupancyGrowthRate / 100, year - 1);
      const adr = assumptions.baseADR * Math.pow(1 + assumptions.adrGrowthRate / 100, year - 1);
      const revpar = (occupancy / 100) * adr;
      const occupiedRooms = (assumptions.numberOfRooms * occupancy) / 100;
      const roomsRevenue = occupiedRooms * adr * 365;
      const otherRevenue = roomsRevenue * 0.15; // 15% of rooms revenue
      const totalRevenue = roomsRevenue + otherRevenue;
      
      // Base expenses as percentage of revenue
      const basePayroll = totalRevenue * 0.35;
      const baseUtilities = totalRevenue * 0.08;
      const baseMarketing = totalRevenue * 0.05;
      const baseMaintenance = totalRevenue * 0.12;
      const baseOtherExpenses = totalRevenue * 0.10;
      
      const payroll = basePayroll * Math.pow(1 + assumptions.expenseGrowthRate / 100, year - 1);
      const utilities = baseUtilities * Math.pow(1 + assumptions.expenseGrowthRate / 100, year - 1);
      const marketing = baseMarketing * Math.pow(1 + assumptions.expenseGrowthRate / 100, year - 1);
      const maintenance = baseMaintenance * Math.pow(1 + assumptions.expenseGrowthRate / 100, year - 1);
      const otherExpenses = baseOtherExpenses * Math.pow(1 + assumptions.expenseGrowthRate / 100, year - 1);
      
      const totalExpenses = payroll + utilities + marketing + maintenance + otherExpenses;
      const noi = totalRevenue - totalExpenses;
      const noiMargin = (noi / totalRevenue) * 100;

      newMetrics.push({
        year,
        occupancy: Math.round(occupancy * 10) / 10,
        adr: Math.round(adr),
        revpar: Math.round(revpar * 10) / 10,
        occupiedRooms: Math.round(occupiedRooms),
        roomsRevenue: Math.round(roomsRevenue),
        otherRevenue: Math.round(otherRevenue),
        totalRevenue: Math.round(totalRevenue),
        payroll: Math.round(payroll),
        utilities: Math.round(utilities),
        marketing: Math.round(marketing),
        maintenance: Math.round(maintenance),
        otherExpenses: Math.round(otherExpenses),
        totalExpenses: Math.round(totalExpenses),
        noi: Math.round(noi),
        noiMargin: Math.round(noiMargin * 10) / 10,
      });
    }
    
    setMetrics(newMetrics);
  }, [assumptions]);

  useEffect(() => {
    calculateMetrics();
  }, [assumptions, calculateMetrics]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }

  const validateInput = (field: keyof HotelAssumptions, value: number): string | undefined => {
    switch (field) {
      case 'numberOfRooms':
        if (value < 1) return 'Minimum 1 room required';
        if (value > 10000) return 'Maximum 10,000 rooms allowed';
        if (!Number.isInteger(value)) return 'Must be a whole number';
        break;
      case 'baseOccupancyRate':
        if (value < 0) return 'Cannot be negative';
        if (value > 100) return 'Cannot exceed 100%';
        break;
      case 'baseADR':
        if (value < 1) return 'Minimum $1 required';
        if (value > 10000) return 'Maximum $10,000 allowed';
        break;
      case 'adrGrowthRate':
        if (value < -10) return 'Minimum -10% allowed';
        if (value > 20) return 'Maximum 20% allowed';
        break;
      case 'occupancyGrowthRate':
        if (value < -20) return 'Minimum -20% allowed';
        if (value > 20) return 'Maximum 20% allowed';
        break;
      case 'expenseGrowthRate':
        if (value < 0) return 'Cannot be negative';
        if (value > 50) return 'Maximum 50% allowed';
        break;
      case 'projectionYears':
        if (value < 3) return 'Minimum 3 years required';
        if (value > 20) return 'Maximum 20 years allowed';
        if (!Number.isInteger(value)) return 'Must be a whole number';
        break;
    }
    return undefined;
  };

  const handleInputChange = (field: keyof HotelAssumptions, value: number) => {
    const error = validateInput(field, value);
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));

    // Only update assumptions if validation passes
    if (!error) {
      setAssumptions(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleExpenseGrowthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    handleInputChange('expenseGrowthRate', value);
  };

  const resetToDefaults = () => {
    setAssumptions({
      numberOfRooms: 100,
      baseOccupancyRate: 70,
      baseADR: 150,
      adrGrowthRate: 3,
      occupancyGrowthRate: 1,
      expenseGrowthRate: 2.5,
      projectionYears: 5
    });
    setActiveTab('overview');
  };

  const generateReport = () => {
    setShowReportModal(true);
  };

  const downloadPDF = async () => {
    try {
      // Show loading state in the same modal
      setIsGeneratingReport(true);
      setCompletedSteps([]);
      
      // Professional loading steps
      const steps = [
        'Initializing AI report generation...',
        'Analyzing hotel financial data...',
        'Generating executive summary...',
        'Creating 5-year projections...',
        'Compiling risk assessment...',
        'Finalizing professional report...',
        'Preparing PDF download...'
      ];
      
      // Simulate step-by-step progress
      for (let i = 0; i < steps.length; i++) {
        setLoadingStep(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
        setCompletedSteps(prev => [...prev, steps[i]]);
      }
      
      // Generate AI report
      console.log('Calling AI API with:', { assumptions, metrics: metrics.length });
      
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assumptions,
          metrics,
          summary: {
            totalRevenue: metrics[metrics.length - 1]?.totalRevenue || 0,
            totalExpenses: metrics[metrics.length - 1]?.totalExpenses || 0,
            noi: metrics[metrics.length - 1]?.noi || 0,
            occupancy: metrics[metrics.length - 1]?.occupancy || 0,
            revpar: metrics[metrics.length - 1]?.revpar || 0
          }
        })
      });
      
      console.log('API response status:', response.status);
      const result = await response.json();
      console.log('API response result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate report');
      }
      
      // Get user name from Clerk
      const userName = user?.firstName || user?.fullName || 'Valued Client';
      
      // Generate PDF
      const { generatePDFReport } = await import('@/lib/pdf-generator');
      const pdf = await generatePDFReport({ assumptions, metrics }, result.report, userName);
      
      // Download with professional filename
      const date = new Date().toISOString().split('T')[0];
      const fileName = `Bridge_${userName.replace(/\s+/g, '_')}_${date}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating report:', error);
      
      // Show error message to user
      alert('Failed to generate AI report. Please check your internet connection and try again.');
    } finally {
      // Reset loading state and close modal
      setIsGeneratingReport(false);
      setLoadingStep('');
      setCompletedSteps([]);
      setShowReportModal(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Year', 'Occupancy %', 'ADR ($)', 'RevPAR ($)', 'Occupied Rooms',
      'Rooms Revenue ($)', 'Other Revenue ($)', 'Total Revenue ($)',
      'Payroll ($)', 'Utilities ($)', 'Marketing ($)', 'Maintenance ($)',
      'Other Expenses ($)', 'Total Expenses ($)', 'NOI ($)', 'NOI Margin %'
    ];
    
    const csvContent = [
      headers.join(','),
      ...metrics.map(m => [
        m.year, m.occupancy, m.adr, m.revpar, m.occupiedRooms,
        m.roomsRevenue, m.otherRevenue, m.totalRevenue,
        m.payroll, m.utilities, m.marketing, m.maintenance,
        m.otherExpenses, m.totalExpenses, m.noi, m.noiMargin
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hotel-pro-forma.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const chartData = metrics.map(m => ({
    year: `Year ${m.year}`,
    revenue: m.totalRevenue,
    expenses: m.totalExpenses,
    noi: m.noi,
    revpar: m.revpar,
    occupancy: m.occupancy
  }));

  const expenseData = metrics.length > 0 ? [
    { name: 'Payroll', value: metrics[metrics.length - 1].payroll },
    { name: 'Utilities', value: metrics[metrics.length - 1].utilities },
    { name: 'Marketing', value: metrics[metrics.length - 1].marketing },
    { name: 'Maintenance', value: metrics[metrics.length - 1].maintenance },
    { name: 'Other', value: metrics[metrics.length - 1].otherExpenses }
  ] : [];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            <Link href="/" className="text-gray-600 hover:text-gray-700 hover:underline">Home</Link>
            <span className="mx-1">&gt;</span>
            <span className="text-gray-500">Pro Forma</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hotel Pro Forma Workspace</h1>
              <p className="text-gray-600 mt-1">
                Input assumptions, run calculations, review metrics, and export financial reports. Projection Years: {assumptions.projectionYears} years.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={generateReport} className="bg-black text-white hover:bg-gray-800 relative overflow-hidden">
                Generate Report
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer transform -skew-x-12"></div>
              </Button>
              <Button onClick={resetToDefaults} className="bg-black text-white hover:bg-gray-800">
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-700">{assumptions.projectionYears}-Year NOI</p>
                    <div className="group relative">
                      <Info className="h-3 w-3 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        Net Operating Income: Revenue minus operating expenses
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Net Operating Income</p>
                  <p className={`text-2xl font-bold mt-1 ${metrics.length > 0 && metrics[metrics.length - 1].noi < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    ${metrics.length > 0 ? metrics[metrics.length - 1].noi.toLocaleString() : '0'}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <CheckCircle className={`h-3 w-3 mr-1 ${metrics.length > 0 && metrics[metrics.length - 1].noi > 0 ? 'text-green-500' : 'text-red-500'}`} />
                    {metrics.length > 0 && metrics[metrics.length - 1].noi > 0 ? "Profitable" : "Loss"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-700">Year {assumptions.projectionYears} Revenue</p>
                    <div className="group relative">
                      <Info className="h-3 w-3 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        Total money earned from rooms and other services
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Total annual revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${metrics.length > 0 ? metrics[metrics.length - 1].totalRevenue.toLocaleString() : '0'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.length > 0 ? ((metrics[metrics.length - 1].totalRevenue / metrics[0].totalRevenue - 1) * 100).toFixed(1) : '0'}% growth
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-700">Year {assumptions.projectionYears} RevPAR</p>
                    <div className="group relative">
                      <Info className="h-3 w-3 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        Revenue Per Available Room: How much each room earns on average
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Revenue per available room</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${metrics.length > 0 ? metrics[metrics.length - 1].revpar.toFixed(0) : '0'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.length > 0 ? ((metrics[metrics.length - 1].revpar / metrics[0].revpar - 1) * 100).toFixed(1) : '0'}% growth
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-700">Year {assumptions.projectionYears} Occupancy</p>
                    <div className="group relative">
                      <Info className="h-3 w-3 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        Percentage of rooms that are occupied by guests
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Average occupancy rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metrics.length > 0 ? metrics[metrics.length - 1].occupancy.toFixed(1) : '0'}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {assumptions.numberOfRooms} rooms • {metrics.length > 0 ? metrics[metrics.length - 1].occupiedRooms.toFixed(0) : '0'} occupied
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotel Assumptions Panel - Always Visible */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl font-semibold text-gray-900">Hotel Assumptions</CardTitle>
                <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                  INPUT
                </span>
              </div>
              <CardDescription className="text-sm text-gray-500">
                Adjust these parameters to model your hotel&apos;s financial performance.
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-6">
            {/* Projection Years - Compact Row */}
            <div className="space-y-3">
              <Label htmlFor="projectionYears" className="text-sm font-semibold text-gray-700">
                Projection Years (5 years is Standard)
                {validationErrors.projectionYears && (
                  <span className="text-red-500 text-xs ml-2">({validationErrors.projectionYears})</span>
                )}
              </Label>
              <div className="w-fit">
                <Input
                  id="projectionYears"
                  type="number"
                  value={assumptions.projectionYears}
                  onChange={(e) => handleInputChange('projectionYears', parseInt(e.target.value) || 3)}
                  className={`bg-gray-50 border-gray-200 w-32 ${validationErrors.projectionYears ? 'border-red-300' : ''}`}
                  placeholder="Enter years"
                  min="3"
                  max="20"
                  step="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Number of Rooms */}
              <div className="space-y-3">
                <Label htmlFor="rooms" className="text-sm font-semibold text-gray-700">
                  Number of Rooms
                  {validationErrors.numberOfRooms && (
                    <span className="text-red-500 text-xs ml-2">({validationErrors.numberOfRooms})</span>
                  )}
                </Label>
                <Input
                  id="rooms"
                  type="number"
                  value={assumptions.numberOfRooms}
                  onChange={(e) => handleInputChange('numberOfRooms', Number(e.target.value))}
                  className={`bg-gray-50 border-gray-200 ${validationErrors.numberOfRooms ? 'border-red-300' : ''}`}
                  placeholder="Enter number of rooms"
                  min="1"
                  max="10000"
                />
              </div>

              {/* Base Occupancy Rate */}
              <div className="space-y-3">
                <Label htmlFor="occupancy" className="text-sm font-semibold text-gray-700">
                  Base Occupancy Rate (%)
                  {validationErrors.baseOccupancyRate && (
                    <span className="text-red-500 text-xs ml-2">({validationErrors.baseOccupancyRate})</span>
                  )}
                </Label>
                <Input
                  id="occupancy"
                  type="number"
                  value={assumptions.baseOccupancyRate}
                  onChange={(e) => handleInputChange('baseOccupancyRate', Number(e.target.value))}
                  className={`bg-gray-50 border-gray-200 ${validationErrors.baseOccupancyRate ? 'border-red-300' : ''}`}
                  placeholder="Enter occupancy rate"
                  min="0"
                  max="100"
                />
              </div>

              {/* Base ADR */}
              <div className="space-y-3">
                <Label htmlFor="adr" className="text-sm font-semibold text-gray-700">
                  Base Average Daily Rate (ADR) ($)
                  {validationErrors.baseADR && (
                    <span className="text-red-500 text-xs ml-2">({validationErrors.baseADR})</span>
                  )}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="adr"
                    type="number"
                    value={assumptions.baseADR}
                    onChange={(e) => handleInputChange('baseADR', Number(e.target.value))}
                    className={`pl-8 bg-gray-50 border-gray-200 ${validationErrors.baseADR ? 'border-red-300' : ''}`}
                    placeholder="Enter daily rate"
                    min="1"
                    max="10000"
                  />
                </div>
              </div>

              {/* Expense Growth Rate */}
              <div className="space-y-3">
                <Label htmlFor="expenseGrowth" className="text-sm font-semibold text-gray-700">
                  Expense Growth Rate (%)
                  {validationErrors.expenseGrowthRate && (
                    <span className="text-red-500 text-xs ml-2">({validationErrors.expenseGrowthRate})</span>
                  )}
                </Label>
                <Input
                  id="expenseGrowth"
                  type="number"
                  value={assumptions.expenseGrowthRate}
                  onChange={handleExpenseGrowthChange}
                  className={`bg-gray-50 border-gray-200 ${validationErrors.expenseGrowthRate ? 'border-red-300' : ''}`}
                  placeholder="Enter expense growth rate"
                  min="0"
                  max="50"
                  step="0.1"
                />
              </div>

              {/* Occupancy Growth Rate */}
              <div className="space-y-3">
                <Label htmlFor="occupancyGrowth" className="text-sm font-semibold text-gray-700">
                  Occupancy Growth Rate (%): {assumptions.occupancyGrowthRate}%
                  {validationErrors.occupancyGrowthRate && (
                    <span className="text-red-500 text-xs ml-2">({validationErrors.occupancyGrowthRate})</span>
                  )}
                </Label>
                <Slider
                  value={[assumptions.occupancyGrowthRate]}
                  onValueChange={(value) => handleInputChange('occupancyGrowthRate', value[0])}
                  max={20}
                  min={-20}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>-20%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* ADR Growth Rate */}
              <div className="space-y-3">
                <Label htmlFor="adrGrowth" className="text-sm font-semibold text-gray-700">
                  ADR Growth Rate (%): {assumptions.adrGrowthRate}%
                  {validationErrors.adrGrowthRate && (
                    <span className="text-red-500 text-xs ml-2">({validationErrors.adrGrowthRate})</span>
                  )}
                </Label>
                <Slider
                  value={[assumptions.adrGrowthRate]}
                  onValueChange={(value) => handleInputChange('adrGrowthRate', value[0])}
                  max={20}
                  min={-10}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>-10%</span>
                  <span>20%</span>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 bg-gray-100 p-2 rounded-lg w-fit">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 font-medium rounded-md shadow-sm transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-white text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('revenue')}
              className={`px-6 py-2 font-medium rounded-md shadow-sm transition-colors ${
                activeTab === 'revenue' 
                  ? 'bg-white text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Revenue
            </button>
            <button 
              onClick={() => setActiveTab('expenses')}
              className={`px-6 py-2 font-medium rounded-md shadow-sm transition-colors ${
                activeTab === 'expenses' 
                  ? 'bg-white text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Expenses
            </button>
            <button 
              onClick={() => setActiveTab('profitability')}
              className={`px-6 py-2 font-medium rounded-md shadow-sm transition-colors ${
                activeTab === 'profitability' 
                  ? 'bg-white text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profitability
            </button>
          </div>
          
          <Button onClick={exportToCSV} className="bg-black text-white hover:bg-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Tab Content - Charts and Graphs */}
        {activeTab === 'overview' && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Overview Dashboard</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Key performance indicators and summary metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Revenue vs Expenses Trend</h3>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        X-axis: Years 1-{assumptions.projectionYears}, Y-axis: Revenue and Expenses in dollars. Shows the relationship between total revenue and total operating expenses over the {assumptions.projectionYears}-year projection period.
                      </div>
                    </div>
                  </div>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="year" 
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-white p-3 shadow-md">
                                <p className="text-sm font-medium text-gray-900">Year {label}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    {entry.name}: ${entry.value?.toLocaleString()}
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="var(--color-revenue)" 
                        strokeWidth={3} 
                        name="Revenue"
                        dot={{ fill: "var(--color-revenue)", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "var(--color-revenue)", strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="var(--color-expenses)" 
                        strokeWidth={3} 
                        name="Expenses"
                        dot={{ fill: "var(--color-expenses)", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "var(--color-expenses)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">NOI Trend</h3>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        X-axis: Years 1-{assumptions.projectionYears}, Y-axis: NOI in dollars. Shows the Net Operating Income trend over the {assumptions.projectionYears}-year projection period, indicating profitability changes.
                      </div>
                    </div>
                  </div>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="year" 
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-white p-3 shadow-md">
                                <p className="text-sm font-medium text-gray-900">Year {label}</p>
                                <p className="text-sm" style={{ color: payload[0].color }}>
                                  NOI: ${payload[0].value?.toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="noi" 
                        fill="var(--color-noi)" 
                        name="NOI"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'revenue' && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Revenue Analysis</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Revenue breakdown and growth trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Composition</h3>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        Pie chart showing the breakdown of total revenue into Rooms Revenue and Other Revenue for Year {assumptions.projectionYears}, displaying the percentage contribution of each revenue stream.
                      </div>
                    </div>
                  </div>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Rooms Revenue', value: metrics.length > 0 ? metrics[metrics.length - 1].roomsRevenue : 0 },
                          { name: 'Other Revenue', value: metrics.length > 0 ? metrics[metrics.length - 1].otherRevenue : 0 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#3B82F6" />
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-white p-3 shadow-md">
                                <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
                                <p className="text-sm" style={{ color: payload[0].color }}>
                                  ${payload[0].value?.toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Growth</h3>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        X-axis: Years 1-{assumptions.projectionYears}, Y-axis: Total Revenue in dollars. Shows the year-over-year growth of total revenue over the {assumptions.projectionYears}-year projection period.
                      </div>
                    </div>
                  </div>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="year" 
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-white p-3 shadow-md">
                                <p className="text-sm font-medium text-gray-900">Year {label}</p>
                                <p className="text-sm" style={{ color: payload[0].color }}>
                                  Total Revenue: ${payload[0].value?.toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="var(--color-revenue)" 
                        name="Total Revenue"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'expenses' && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Expense Analysis</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Detailed expense breakdown and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        Pie chart showing the breakdown of total expenses into Payroll, Utilities, Marketing, Maintenance, and Other Expenses for Year {assumptions.projectionYears}, displaying the percentage contribution of each expense category.
                      </div>
                    </div>
                  </div>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-white p-3 shadow-md">
                                <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
                                <p className="text-sm" style={{ color: payload[0].color }}>
                                  ${payload[0].value?.toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Expense Trends</h3>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        X-axis: Years 1-{assumptions.projectionYears}, Y-axis: Total Expenses in dollars. Shows the year-over-year growth of total operating expenses over the {assumptions.projectionYears}-year projection period.
                      </div>
                    </div>
                  </div>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="year" 
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-white p-3 shadow-md">
                                <p className="text-sm font-medium text-gray-900">Year {label}</p>
                                <p className="text-sm" style={{ color: payload[0].color }}>
                                  Total Expenses: ${payload[0].value?.toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="expenses" 
                        fill="var(--color-expenses)" 
                        name="Total Expenses"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'profitability' && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Profitability Analysis</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                NOI, margins, and profitability trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">NOI Trend</h3>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        X-axis: Years 1-{assumptions.projectionYears}, Y-axis: NOI in dollars. Shows the Net Operating Income trend over the {assumptions.projectionYears}-year projection period, indicating profitability changes and margin compression.
                      </div>
                    </div>
                  </div>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="year" 
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-white p-3 shadow-md">
                                <p className="text-sm font-medium text-gray-900">Year {label}</p>
                                <p className="text-sm" style={{ color: payload[0].color }}>
                                  NOI: ${payload[0].value?.toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="noi" 
                        stroke="var(--color-noi)" 
                        strokeWidth={3} 
                        name="NOI"
                        dot={{ fill: "var(--color-noi)", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "var(--color-noi)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">RevPAR & Occupancy</h3>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm">
                        X-axis: Years 1-{assumptions.projectionYears}, Y-axis: RevPAR in dollars and Occupancy as percentage. Shows the relationship between Revenue per Available Room and Occupancy Rate over the {assumptions.projectionYears}-year projection period.
                      </div>
                    </div>
                  </div>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="year" 
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        yAxisId="left" 
                        tickFormatter={(value) => `$${value}`}
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        tickFormatter={(value) => `${value}%`}
                        className="text-gray-600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-white p-3 shadow-md">
                                <p className="text-sm font-medium text-gray-900">Year {label}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    {entry.name}: {String(entry.name)?.includes('$') ? `$${entry.value}` : `${entry.value}%`}
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="revpar" 
                        stroke="var(--color-revpar)" 
                        strokeWidth={3} 
                        name="RevPAR ($)"
                        dot={{ fill: "var(--color-revpar)", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "var(--color-revpar)", strokeWidth: 2 }}
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="occupancy" 
                        stroke="var(--color-occupancy)" 
                        strokeWidth={3} 
                        name="Occupancy (%)"
                        dot={{ fill: "var(--color-occupancy)", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "var(--color-occupancy)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic Financial Summary Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {activeTab === 'overview' && 'Key Metrics Summary'}
                {activeTab === 'revenue' && 'Revenue Summary'}
                {activeTab === 'expenses' && 'Expenses Summary'}
                {activeTab === 'profitability' && 'Net Operating Income (NOI)'}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {activeTab === 'overview' && `Core performance indicators across ${assumptions.projectionYears}-year projection`}
                {activeTab === 'revenue' && `Revenue breakdown by category across ${assumptions.projectionYears}-year projection`}
                {activeTab === 'expenses' && `Detailed expense breakdown across ${assumptions.projectionYears}-year projection`}
                {activeTab === 'profitability' && `Profitability analysis with NOI margin across ${assumptions.projectionYears}-year projection`}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    {activeTab === 'overview' && (
                      <>
                        <TableHead>Occupancy %</TableHead>
                        <TableHead>ADR ($)</TableHead>
                        <TableHead>RevPAR ($)</TableHead>
                        <TableHead>Occupied Rooms</TableHead>
                      </>
                    )}
                    {activeTab === 'revenue' && (
                      <>
                        <TableHead>Rooms Revenue ($)</TableHead>
                        <TableHead>Other Revenue ($)</TableHead>
                        <TableHead>Total Revenue ($)</TableHead>
                      </>
                    )}
                    {activeTab === 'expenses' && (
                      <>
                        <TableHead>Payroll ($)</TableHead>
                        <TableHead>Utilities ($)</TableHead>
                        <TableHead>Marketing ($)</TableHead>
                        <TableHead>Maintenance ($)</TableHead>
                        <TableHead>Other Expenses ($)</TableHead>
                        <TableHead>Total Expenses ($)</TableHead>
                      </>
                    )}
                    {activeTab === 'profitability' && (
                      <>
                        <TableHead>Total Revenue ($)</TableHead>
                        <TableHead>Total Expenses ($)</TableHead>
                        <TableHead>NOI ($)</TableHead>
                        <TableHead>NOI Margin %</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric.year}>
                      <TableCell className="font-medium">{metric.year}</TableCell>
                      {activeTab === 'overview' && (
                        <>
                          <TableCell>{metric.occupancy}%</TableCell>
                          <TableCell>${metric.adr.toLocaleString()}</TableCell>
                          <TableCell>${metric.revpar.toLocaleString()}</TableCell>
                          <TableCell>{metric.occupiedRooms}</TableCell>
                        </>
                      )}
                      {activeTab === 'revenue' && (
                        <>
                          <TableCell>${metric.roomsRevenue.toLocaleString()}</TableCell>
                          <TableCell>${metric.otherRevenue.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold">${metric.totalRevenue.toLocaleString()}</TableCell>
                        </>
                      )}
                      {activeTab === 'expenses' && (
                        <>
                          <TableCell>${metric.payroll.toLocaleString()}</TableCell>
                          <TableCell>${metric.utilities.toLocaleString()}</TableCell>
                          <TableCell>${metric.marketing.toLocaleString()}</TableCell>
                          <TableCell>${metric.maintenance.toLocaleString()}</TableCell>
                          <TableCell>${metric.otherExpenses.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold">${metric.totalExpenses.toLocaleString()}</TableCell>
                        </>
                      )}
                      {activeTab === 'profitability' && (
                        <>
                          <TableCell>${metric.totalRevenue.toLocaleString()}</TableCell>
                          <TableCell>${metric.totalExpenses.toLocaleString()}</TableCell>
                          <TableCell className={metric.noi >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                            ${metric.noi.toLocaleString()}
                          </TableCell>
                          <TableCell className={metric.noiMargin >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                            {metric.noiMargin}%
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Report Generation Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Generate Hotel Pro Forma Report</h2>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {!isGeneratingReport ? (
                  <>
                    {/* Action Buttons */}
                    <div className="flex space-x-3 mb-6">
                      <Button
                        onClick={downloadPDF}
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button
                        onClick={() => setShowReportModal(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Current Assumptions */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Current Assumptions</h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rooms:</span>
                              <span className="font-medium">{assumptions.numberOfRooms}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Occupancy:</span>
                              <span className="font-medium">{assumptions.baseOccupancyRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Base ADR:</span>
                              <span className="font-medium">${assumptions.baseADR}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">ADR Growth:</span>
                              <span className="font-medium">{assumptions.adrGrowthRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Occupancy Growth:</span>
                              <span className="font-medium">{assumptions.occupancyGrowthRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Expense Growth:</span>
                              <span className="font-medium">{assumptions.expenseGrowthRate}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics Summary */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">{assumptions.projectionYears}-Year Projection Summary</h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenue:</span>
                          <span className="font-medium">${metrics[metrics.length - 1]?.totalRevenue.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expenses:</span>
                          <span className="font-medium">${metrics[metrics.length - 1]?.totalExpenses.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">NOI:</span>
                          <span className={`font-medium ${metrics[metrics.length - 1]?.noi && metrics[metrics.length - 1].noi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${metrics[metrics.length - 1]?.noi.toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Occupancy:</span>
                          <span className="font-medium">{metrics[metrics.length - 1]?.occupancy.toFixed(1) || '0'}%</span>
                        </div>
                        <div className="flex justify-between col-span-2">
                          <span className="text-gray-600">RevPAR:</span>
                          <span className="font-medium">${metrics[metrics.length - 1]?.revpar.toFixed(0) || '0'}</span>
                        </div>
                          </div>
                        </div>
                      </div>

                      {/* Report Contents */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">AI-Powered Report Contents</h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">•</span>
                              <span className="text-gray-700">AI-generated executive summary</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">•</span>
                              <span className="text-gray-700">Complete 5-year financial projections</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">•</span>
                              <span className="text-gray-700">Professional financial analysis</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">•</span>
                              <span className="text-gray-700">Risk assessment and recommendations</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">•</span>
                              <span className="text-gray-700">Bridge-branded PDF format</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Professional Loading Content */
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Your Report</h3>
                      <p className="text-gray-600 text-sm">Please wait while we process your financial data</p>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Completed Steps */}
                      {completedSteps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-green-700 text-sm">{step}</span>
                        </div>
                      ))}
                      
                      {/* Current Step */}
                      {loadingStep && (
                        <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <span className="text-yellow-700 text-sm">{loadingStep}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-500 text-xs">
                        This may take a few moments to complete
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
