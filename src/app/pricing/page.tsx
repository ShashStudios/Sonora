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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Basic (Most Popular) */}
          <div className="relative rounded-2xl border-2 border-[#7ed957] p-8 pt-16 bg-white shadow-md">
            <div className="absolute top-0 left-0 right-0 h-10 rounded-t-2xl bg-[#7ed957] flex items-center justify-center text-black text-sm md:text-base font-bold">
              $1/month for first 3 months
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Basic</h3>
                <p className="text-gray-600 text-sm">For solo entrepreneurs</p>
              </div>
              <span className="text-xs bg-[#7ed957] text-black px-3 py-1 rounded-full">Most Popular</span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Starting at</p>
              <div className="text-5xl font-bold">$29<span className="text-base align-top ml-1">USD</span><span className="text-base font-normal">/month</span></div>
              <p className="text-gray-500 text-sm mt-1">billed once yearly</p>
              <p className="text-gray-600 text-sm mt-1">Yearly subscription price $29 USD per month</p>
            </div>
            <hr className="my-5 border-gray-200" />
            <div>
              <h4 className="font-semibold text-gray-900">Card rates starting at</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><CheckIcon /> 2.9% + 30¢ USD online</li>
                <li className="flex items-start gap-2"><CheckIcon /> 2.6% + 10¢ USD in person</li>
                <li className="flex items-start gap-2"><CheckIcon /> 2% 3rd-party payment providers</li>
              </ul>
            </div>
            <hr className="my-5 border-gray-200" />
            <div>
              <h4 className="font-semibold text-gray-900">Standout features</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><CheckIcon /> Up to 77% shipping discount</li>
                <li className="flex items-start gap-2"><CheckIcon /> 10 inventory locations</li>
                <li className="flex items-start gap-2"><CheckIcon /> 24/7 chat support</li>
                <li className="flex items-start gap-2"><CheckIcon /> In-person selling by phone or POS device</li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/market"
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-11 px-6 w-full"
              >
                Try for free
              </Link>
            </div>
          </div>

          {/* Grow */}
          <div className="relative rounded-2xl border border-gray-200 p-8 pt-16 bg-white shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-10 rounded-t-2xl bg-[#7ed957] flex items-center justify-center text-black text-sm md:text-base font-bold">
              $1/month for first 3 months
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Grow</h3>
              <p className="text-gray-600 text-sm">For small teams</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Starting at</p>
              <div className="text-5xl font-bold">$79<span className="text-base align-top ml-1">USD</span><span className="text-base font-normal">/month</span></div>
              <p className="text-gray-500 text-sm mt-1">billed once yearly</p>
              <p className="text-gray-600 text-sm mt-1">Yearly subscription price $79 USD per month</p>
            </div>
            <hr className="my-5 border-gray-200" />
            <div>
              <h4 className="font-semibold text-gray-900">Card rates starting at</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><CheckIcon /> 2.7% + 30¢ USD online</li>
                <li className="flex items-start gap-2"><CheckIcon /> 2.5% + 10¢ USD in person</li>
                <li className="flex items-start gap-2"><CheckIcon /> 1% 3rd-party payment providers</li>
              </ul>
            </div>
            <hr className="my-5 border-gray-200" />
            <div>
              <h4 className="font-semibold text-gray-900">Standout features</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><CheckIcon /> Up to 88% shipping discount and insurance</li>
                <li className="flex items-start gap-2"><CheckIcon /> 10 inventory locations</li>
                <li className="flex items-start gap-2"><CheckIcon /> 24/7 chat support</li>
                <li className="flex items-start gap-2"><CheckIcon /> 5 staff accounts</li>
                <li className="flex items-start gap-2"><CheckIcon /> In-person selling by phone or POS device</li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/market"
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-11 px-6 w-full"
              >
                Try for free
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
