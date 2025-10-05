"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Volume2, Search, Store as StoreIcon, ShoppingCart } from "lucide-react";
import SonoraAgent from "@/components/SonoraAgent";

interface StoreInfo {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export default function MarketplacePage() {
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/marketplace/stores');
      if (response.ok) {
        const data = await response.json();
        setStores(data.stores || []);
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Sonora Marketplace</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/cart"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </Link>
              <Link 
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Voice-First Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover accessible stores created by people with disabilities, for everyone.
            Every store is fully navigable by voice.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stores or products..."
                className="w-full px-6 py-4 pr-12 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg"
                aria-label="Search marketplace"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Featured Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Want to sell on Sonora?</h2>
              <p className="text-blue-100">
                Create your store using voice commands. No complex setup, no barriers.
              </p>
            </div>
            <Link
              href="/seller/voice-onboard"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold flex items-center gap-2 whitespace-nowrap"
            >
              Start with Voice
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchQuery ? 'Search Results' : 'All Stores'}
            <span className="text-gray-500 font-normal ml-2">
              ({filteredStores.length})
            </span>
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading stores...</p>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {searchQuery ? 'No stores found matching your search' : 'No stores yet'}
              </p>
              <Link
                href="/seller"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Be the first seller!
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <Link
                  key={store.id}
                  href={`/store/${store.id}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-blue-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Store className="w-6 h-6 text-blue-600" />
                    </div>
                    <Volume2 className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {store.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {store.description || 'A voice-accessible store on Sonora'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ShoppingBag className="w-4 h-4" />
                      <span>{store.productCount} products</span>
                    </div>
                    <span className="text-blue-600 font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
                      Shop Now
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Voice Navigation</h3>
            <p className="text-gray-600 text-sm">
              Every store can be browsed entirely with voice commands. No typing required.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Accessible Sellers</h3>
            <p className="text-gray-600 text-sm">
              All stores are created by people with disabilities, making online selling accessible.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Instant Checkout</h3>
            <p className="text-gray-600 text-sm">
              Complete purchases with voice. Secure, fast, and completely accessible.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
