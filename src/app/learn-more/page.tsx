import Link from "next/link";
import { ArrowLeft, TrendingUp, BarChart3, PieChart, FileText, Calculator } from "lucide-react";

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hotel Pro Forma Guide</h1>
          <p className="text-xl text-gray-600">
            Understanding financial projections for hotel investments
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* What is Pro Forma */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is a Hotel Pro Forma?</h2>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              A <strong>pro forma</strong> is a financial projection that estimates a hotel&apos;s future performance 
              over a specific period. It&apos;s an essential tool for investors, lenders, and hotel operators to 
              evaluate the financial viability and potential return on investment of a hotel property.
            </p>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Our Hotel Pro Forma Builder helps you create professional financial projections by inputting 
            key assumptions about your property and automatically calculating detailed revenue, expense, 
            and profitability forecasts.
          </p>
        </section>

        {/* Key Financial Terms */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Financial Terms</h2>
          <div className="grid gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                ADR (Average Daily Rate)
              </h3>
              <p className="text-gray-700">
                <strong>Definition:</strong> The average revenue earned per occupied room per day.
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Formula:</strong> Total Room Revenue ÷ Number of Occupied Rooms
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Why it matters:</strong> ADR indicates pricing power and market positioning. 
                Higher ADR suggests premium positioning or strong demand.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                RevPAR (Revenue Per Available Room)
              </h3>
              <p className="text-gray-700">
                <strong>Definition:</strong> The total revenue generated per available room, whether occupied or not.
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Formula:</strong> ADR × Occupancy Rate
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Why it matters:</strong> RevPAR is the industry&apos;s key performance indicator, 
                combining both occupancy and rate performance into a single metric.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                NOI (Net Operating Income)
              </h3>
              <p className="text-gray-700">
                <strong>Definition:</strong> The income generated from hotel operations after operating expenses, 
                but before debt service and taxes.
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Formula:</strong> Total Revenue - Operating Expenses
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Why it matters:</strong> NOI determines the property&apos;s ability to generate cash flow 
                and service debt. It&apos;s the primary metric lenders use to evaluate loan capacity.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-orange-600" />
                Occupancy Rate
              </h3>
              <p className="text-gray-700">
                <strong>Definition:</strong> The percentage of available rooms that are occupied during a given period.
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Formula:</strong> (Occupied Rooms ÷ Total Available Rooms) × 100
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Why it matters:</strong> Occupancy rate indicates demand levels and market penetration. 
                Higher occupancy suggests strong market demand or competitive pricing.
              </p>
            </div>
          </div>
        </section>

        {/* Understanding the Graphs */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding the Visualizations</h2>
          <div className="grid gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Revenue Growth Chart</h3>
              <p className="text-gray-700 mb-3">
                Shows how your hotel&apos;s total revenue is projected to grow over time, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Room revenue from guest stays</li>
                <li>Other revenue from amenities and services</li>
                <li>Total revenue combining all income sources</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">NOI Trend Analysis</h3>
              <p className="text-gray-700 mb-3">
                Tracks your hotel&apos;s profitability over the projection period, showing:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Net Operating Income growth patterns</li>
                <li>Profitability trends and seasonal variations</li>
                <li>NOI margin percentage over time</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">RevPAR & Occupancy Trends</h3>
              <p className="text-gray-700 mb-3">
                Displays the relationship between your key performance metrics:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>RevPAR growth driven by rate and occupancy</li>
                <li>Occupancy rate trends and seasonality</li>
                <li>ADR performance and pricing power</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expense Breakdown</h3>
              <p className="text-gray-700 mb-3">
                Illustrates how operating costs are distributed across different categories:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Payroll and labor costs</li>
                <li>Utilities and maintenance</li>
                <li>Marketing and administrative expenses</li>
                <li>Other operational costs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Report Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Report Features</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-3 text-blue-600" />
              Comprehensive Financial Analysis
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>High-level performance overview</li>
                  <li>Key financial highlights</li>
                  <li>Investment opportunity assessment</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Financial Projections</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Multi-year revenue forecasts</li>
                  <li>Expense trend analysis</li>
                  <li>NOI margin projections</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Risk Assessment</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Market risk evaluation</li>
                  <li>Operational challenges</li>
                  <li>Financial risk factors</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Performance improvement strategies</li>
                  <li>Risk mitigation approaches</li>
                  <li>Investment optimization tips</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Helps */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How Pro Forma Analysis Helps Hotel Investors</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Investment Decision Making</h3>
              <p className="text-gray-600">
                Evaluate potential returns, assess risk levels, and compare different hotel investment 
                opportunities with standardized financial projections.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lender Presentations</h3>
              <p className="text-gray-600">
                Present professional financial projections to banks and lenders to secure financing 
                with clear, data-driven business plans.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Operational Planning</h3>
              <p className="text-gray-600">
                Plan staffing levels, budget for maintenance, and set realistic revenue targets 
                based on market conditions and property characteristics.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Monitoring</h3>
              <p className="text-gray-600">
                Track actual performance against projections to identify trends, adjust strategies, 
                and optimize operations for better results.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Build Your Hotel Pro Forma?</h2>
          <p className="text-gray-600 mb-6">
            Start creating professional financial projections for your hotel investment today.
          </p>
          <Link
            href="/forma"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 17L17 7M17 7H7M17 7V17"
              />
            </svg>
            Get started
          </Link>
        </section>
      </div>
    </div>
  );
}
