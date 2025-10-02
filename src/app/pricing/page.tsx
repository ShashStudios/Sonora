"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  const prices = {
    free: { monthly: "$0", yearly: "$0" },
    explorer: { monthly: "$15", yearly: "$12.50" },
    scholar: { monthly: "$25", yearly: "$20.83" },
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-center">Pricing Plans</h1>

        {/* Toggle */}
        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
          <button
            className={`px-4 py-2 rounded-full border ${
              billing === "monthly"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200"
            }`}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-full border ${
              billing === "yearly"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200"
            }`}
            onClick={() => setBilling("yearly")}
          >
            Yearly
          </button>
        </div>

        {/* Subtext */}
        <p className="text-center text-gray-600 mt-6 max-w-2xl mx-auto">
          Simple, transparent pricing for the first AI-native marketplace. Discover, compare,
          and deploy AI solutions effortlessly. Scale as you grow.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Free */}
          <div className="rounded-2xl border border-gray-200 p-8 bg-white shadow-sm">
            <h3 className="text-xl font-semibold">Free</h3>
            <div className="mt-2 text-4xl font-bold">{billing === "yearly" ? prices.free.yearly : prices.free.monthly}
              <span className="text-sm font-normal text-gray-500"> USD/month</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2"><CheckIcon /> Limited browsing of AI vendors</li>
              <li className="flex items-start gap-2"><CheckIcon /> Basic comparisons</li>
              <li className="flex items-start gap-2"><CheckIcon /> Save up to 3 products</li>
              <li className="flex items-start gap-2"><CheckIcon /> Email updates for new listings</li>
            </ul>
            <div className="mt-8">
              <Link
                href="/market"
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-11 px-6"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Explorer - Most Popular */}
          <div className="relative rounded-2xl border-2 border-gray-300 p-8 bg-white shadow-md">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-gray-900 text-white px-3 py-1 rounded-full">
              Most Popular
            </span>
            <h3 className="text-xl font-semibold">Explorer</h3>
            <div className="mt-2 text-4xl font-bold">{billing === "yearly" ? prices.explorer.yearly : prices.explorer.monthly}
              <span className="text-sm font-normal text-gray-500"> USD/month</span>
            </div>
            <div className="mt-3 text-xs bg-gray-100 text-gray-700 rounded-lg px-3 py-2">
              <span className="mr-1">🎓</span>
              Students with their education email get an extra 20% off all plans!
            </div>
            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2"><CheckIcon /> Unlimited vendor browsing</li>
              <li className="flex items-start gap-2"><CheckIcon /> Unlimited comparisons</li>
              <li className="flex items-start gap-2"><CheckIcon /> Shortlist management</li>
              <li className="flex items-start gap-2"><CheckIcon /> Export vendor lists</li>
              <li className="flex items-start gap-2"><CheckIcon /> Early access to new AI categories</li>
            </ul>
            <div className="mt-8">
              <Link
                href="/market"
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-11 px-6"
              >
                Get Explorer
              </Link>
            </div>
          </div>

          {/* Scholar */}
          <div className="rounded-2xl border border-gray-200 p-8 bg-white shadow-sm">
            <h3 className="text-xl font-semibold">Scholar</h3>
            <div className="mt-2 text-4xl font-bold">{billing === "yearly" ? prices.scholar.yearly : prices.scholar.monthly}
              <span className="text-sm font-normal text-gray-500"> USD/month</span>
            </div>
            <div className="mt-3 text-xs bg-gray-100 text-gray-700 rounded-lg px-3 py-2">
              <span className="mr-1">🎓</span>
              Students with their education email get an extra 20% off all plans!
            </div>
            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2"><CheckIcon /> Everything in Explorer</li>
              <li className="flex items-start gap-2"><CheckIcon /> Priority vendor support</li>
              <li className="flex items-start gap-2"><CheckIcon /> Unlimited exports</li>
              <li className="flex items-start gap-2"><CheckIcon /> Team seats & collaboration</li>
              <li className="flex items-start gap-2"><CheckIcon /> Version history of shortlists</li>
            </ul>
            <div className="mt-8">
              <Link
                href="/market"
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-11 px-6"
              >
                Get Scholar
              </Link>
            </div>
          </div>
        </div>

        {/* Footer fine print */}
        <p className="text-xs text-gray-500 text-center mt-10">
          All prices are shown in USD. Student discounts apply automatically with verified education email.\n
        </p>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
