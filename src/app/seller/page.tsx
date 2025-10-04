"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Volume2, Plus, Package, DollarSign, ShoppingCart, 
  TrendingUp, ArrowLeft, Play, Settings 
} from "lucide-react";

export default function SellerDashboard() {
  const [playingBrief, setPlayingBrief] = useState(false);

  const handlePlayDailyBrief = async () => {
    setPlayingBrief(true);
    try {
      const response = await fetch('/api/seller/daily-brief');
      const data = await response.json();
      
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play();
        audio.onended = () => setPlayingBrief(false);
      }
    } catch (error) {
      console.error('Failed to play daily brief:', error);
      setPlayingBrief(false);
    }
  };

  // Mock data - will be replaced with real data from API
  const stats = {
    totalSales: 1247.50,
    orderCount: 12,
    productCount: 8,
    topProduct: "Premium Wireless Headphones"
  };

  const recentOrders = [
    { id: "ORD-001", product: "Wireless Headphones", amount: 89.99, status: "completed", date: "2h ago" },
    { id: "ORD-002", product: "USB-C Cable", amount: 12.99, status: "pending", date: "5h ago" },
    { id: "ORD-003", product: "Phone Case", amount: 24.99, status: "completed", date: "1d ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Seller Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayDailyBrief}
                disabled={playingBrief}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Play daily sales brief"
              >
                <Play className={`w-4 h-4 ${playingBrief ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">
                  {playingBrief ? 'Playing Brief...' : 'Daily Brief'}
                </span>
              </button>
              <Link 
                href="/seller/settings"
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sales */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Sales</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${stats.totalSales.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>

          {/* Orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Orders</span>
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.orderCount}</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>

          {/* Products */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Products</span>
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.productCount}</p>
            <p className="text-sm text-gray-500 mt-1">Active listings</p>
          </div>

          {/* Top Product */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Top Product</span>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-lg font-bold text-gray-900 truncate">{stats.topProduct}</p>
            <p className="text-sm text-gray-500 mt-1">Best seller</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/seller/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white p-8 rounded-xl shadow-sm transition-colors flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Add New Product</h3>
              <p className="text-blue-100">List a product with voice description</p>
            </div>
          </Link>

          <Link
            href="/seller/products"
            className="bg-gray-900 hover:bg-gray-800 text-white p-8 rounded-xl shadow-sm transition-colors flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Manage Products</h3>
              <p className="text-gray-300">View and edit your listings</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentOrders.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No orders yet</p>
            </div>
          )}
        </div>

        {/* Stripe Connect Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">💳 Setup Payments</h3>
          <p className="text-blue-800 mb-4">
            Connect your Stripe account to receive payouts from your sales.
          </p>
          <Link
            href="/seller/connect-stripe"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Connect Stripe Account
          </Link>
        </div>
      </main>
    </div>
  );
}
