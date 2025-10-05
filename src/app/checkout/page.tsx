"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Only load Stripe if key is available
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function CheckoutForm({ sessionId }: { sessionId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Submit payment element
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        elements,
      });

      if (paymentError) {
        setErrorMessage(paymentError.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      // Complete checkout via ACP
      const completeResponse = await fetch(
        `/api/acp/checkout_sessions/${sessionId}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_data: {
              stripe_payment_method_id: paymentMethod.id,
            },
          }),
        }
      );

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        setErrorMessage(errorData.error || "Payment failed");
        setIsProcessing(false);
        return;
      }

      const completedSession = await completeResponse.json();
      
      // Clear cart and redirect to success
      clearCart();
      router.push(`/checkout/success?orderId=${completedSession.order_id}`);
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { items, total } = useCart();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (items.length === 0) {
      router.push("/shop");
      return;
    }

    // Create checkout session
    const createSession = async () => {
      try {
        console.log("Creating checkout session with items:", items);

        const response = await fetch("/api/acp/checkout_sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              id: item.id || String(items.indexOf(item) + 1), // Use item.id if available
              quantity: item.quantity,
            })),
            buyer_email: user?.primaryEmailAddress?.emailAddress,
            fulfillment_address: {
              name: user?.fullName || "Customer",
              line_one: "123 Main St",
              city: "San Francisco",
              state: "CA",
              country: "US",
              postal_code: "94131",
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create checkout session");
        }

        const session = await response.json();
        setSessionId(session.id);

        // Create Stripe PaymentIntent
        const paymentResponse = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: session.totals.find((t: any) => t.type === "total")?.amount || 0,
          }),
        });

        if (!paymentResponse.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { clientSecret } = await paymentResponse.json();
        setClientSecret(clientSecret);
        setIsCreatingSession(false);
      } catch (error) {
        console.error("Error creating checkout session:", error);
        alert("Failed to initialize checkout. Please try again.");
        router.push("/shop");
      }
    };

    if (isLoaded && isSignedIn && items.length > 0) {
      createSession();
    }
  }, [isLoaded, isSignedIn, items, user, router]);

  if (!isLoaded || isCreatingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (!stripePromise || !stripeKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Stripe Not Configured</h2>
          <p className="text-gray-700 mb-4">
            Stripe payment integration is not configured. Please add your Stripe keys to <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>:
          </p>
          <pre className="bg-gray-100 p-4 rounded text-left text-sm mb-4">
{`STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`}
          </pre>
          <p className="text-sm text-gray-600 mb-4">
            Get your keys from: <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Dashboard</a>
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  if (!sessionId || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          {/* Order Summary */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-700">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                },
              }}
            >
              <CheckoutForm sessionId={sessionId} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
