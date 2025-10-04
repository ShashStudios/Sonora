"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Volume2, Play, Loader2 } from "lucide-react";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  items: Array<{
    product: { name: string };
    quantity: number;
    priceAtPurchase: number;
  }>;
  createdAt: string;
}

export default function CheckoutResultPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingReceipt, setPlayingReceipt] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const playVoiceReceipt = async () => {
    if (!order) return;
    
    setPlayingReceipt(true);
    try {
      const response = await fetch('/api/voice/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audio.play();
          audio.onended = () => setPlayingReceipt(false);
        }
      }
    } catch (error) {
      console.error('Failed to play receipt:', error);
      setPlayingReceipt(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your purchase using Sonora
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            <span>Order ID:</span>
            <span className="font-mono">{order.id}</span>
          </div>
        </div>

        {/* Voice Receipt */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-sm p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="w-6 h-6" />
            <h2 className="text-xl font-bold">Voice Receipt</h2>
          </div>
          <p className="mb-6 text-blue-100">
            Listen to your order confirmation in voice. Perfect for hands-free or eyes-free confirmation.
          </p>
          <button
            onClick={playVoiceReceipt}
            disabled={playingReceipt}
            className="flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className={`w-5 h-5 ${playingReceipt ? 'animate-pulse' : ''}`} />
            {playingReceipt ? 'Playing Receipt...' : 'Play Voice Receipt'}
          </button>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
          
          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.product.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold text-gray-900">
                  ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl font-bold text-gray-900">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <h3 className="font-bold text-gray-900 mb-2">Payment Method</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>OpenAI Agentic Commerce Protocol (ACP)</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Your payment was processed securely using instant checkout
          </p>
        </div>

        {/* Accessibility Features */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-2">♿ Accessible Features Used</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Voice-guided checkout process</li>
            <li>✓ Screen reader optimized confirmation</li>
            <li>✓ Voice receipt playback available</li>
            <li>✓ High contrast order summary</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/store/demo"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
