"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Home } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const total = searchParams.get('total');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <div className="text-center max-w-md px-4">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-2">Your order has been confirmed.</p>
        
        {total && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Amount Paid</p>
            <p className="text-4xl font-bold text-green-600">${total}</p>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800">
            ✉️ A confirmation email has been sent to your inbox.
          </p>
        </div>

        <div className="space-y-3">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition font-bold"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <Link 
            href="/marketplace"
            className="block text-blue-600 hover:text-blue-700 font-medium"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Order number: #{Date.now().toString().slice(-8)}
          </p>
        </div>
      </div>
    </div>
  );
}
