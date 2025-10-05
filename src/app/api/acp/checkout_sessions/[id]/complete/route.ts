import { NextRequest, NextResponse } from "next/server";
import { CompleteCheckoutSessionRequest } from "@/lib/acp-types";
import { getSession, updateSession } from "@/lib/session-store";
import { chargePaymentMethod } from "@/lib/stripe";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: CompleteCheckoutSessionRequest = await req.json();
    
    console.log("💳 Completing checkout session:", id);

    const session = getSession(id);
    if (!session) {
      return NextResponse.json(
        { error: "Checkout session not found" },
        { status: 404 }
      );
    }

    if (session.status !== "ready_for_payment") {
      return NextResponse.json(
        { error: "Checkout session is not ready for payment" },
        { status: 400 }
      );
    }

    // Get total amount
    const totalAmount = session.totals.find((t) => t.type === "total")?.amount || 0;

    try {
      // Charge the payment method with Stripe
      if (body.payment_data.stripe_payment_method_id) {
        console.log("💰 Charging payment method:", body.payment_data.stripe_payment_method_id);
        
        const paymentIntent = await chargePaymentMethod(
          body.payment_data.stripe_payment_method_id,
          totalAmount,
          session.currency
        );

        console.log("✅ Payment successful:", paymentIntent.id);

        // Generate order ID
        const orderId = `order_${uuidv4()}`;

        // Update session
        session.status = "completed";
        session.order_id = orderId;
        session.payment_data = body.payment_data;

        updateSession(id, session);

        console.log("✅ Order created:", orderId);

        return NextResponse.json(session);
      } else {
        throw new Error("No payment method provided");
      }
    } catch (paymentError) {
      console.error("❌ Payment failed:", paymentError);
      
      // Add error message to session
      session.messages = [
        {
          type: "error",
          code: "payment_failed",
          content_type: "plain",
          content: "Payment failed. Please try again with a different payment method.",
        },
      ];

      return NextResponse.json(
        { error: "Payment failed", details: String(paymentError), session },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error("❌ Error completing checkout session:", error);
    return NextResponse.json(
      { error: "Failed to complete checkout session", details: String(error) },
      { status: 500 }
    );
  }
}
