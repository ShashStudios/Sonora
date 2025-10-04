"use client";

import Link from "next/link";
import { Mic, Volume2, Accessibility } from "lucide-react";
import SonoraAgent from "@/components/SonoraAgent";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Sonora</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 font-medium">
                Marketplace
              </Link>
              <Link href="/seller" className="text-gray-600 hover:text-gray-900 font-medium">
                For Sellers
              </Link>
              <Link href="/a11y" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                <span>Accessibility</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
              Shop with Your Voice.<br />
              <span className="text-blue-600">Sell with ease.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              E-commerce designed for blind, low-vision, and mobility-limited users. 
              Everything is voice-first, eyes-free, and hands-free.
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3">
                👋 Sonora is in the bottom-right!
              </h3>
              <p className="text-lg text-blue-800 mb-4">
                Press and hold <kbd className="px-3 py-1 bg-blue-200 rounded font-bold">Enter/Space</kbd> or the mic button to talk.
              </p>
              <div className="bg-white rounded-lg p-4 text-left">
                <p className="font-bold text-gray-900 mb-2">Try saying:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• "Show me the marketplace"</li>
                  <li>• "Find me headphones under $100"</li>
                  <li>• "I want to create a store"</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sonora Agent */}
      <SonoraAgent initialOpen={true} />
    </div>
  );
}
