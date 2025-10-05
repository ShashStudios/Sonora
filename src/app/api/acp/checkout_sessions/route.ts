import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  CreateCheckoutSessionRequest,
  CheckoutSession,
  ACPLineItem,
  ACPTotal,
} from "@/lib/acp-types";
import { createSession } from "@/lib/session-store";
import { getProducts } from "@/lib/products";

// Tax rate (10% for demo)
const TAX_RATE = 0.10;

export async function POST(req: NextRequest) {
  try {
    const body: CreateCheckoutSessionRequest = await req.json();
    
    console.log("📦 Creating checkout session:", body);

    // Generate session ID
    const sessionId = `cs_${uuidv4()}`;

    // Fetch products from API
    const products = await getProducts();

    // Calculate line items
    const lineItems: ACPLineItem[] = body.items.map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }

      const baseAmount = product.price * 100 * item.quantity; // Convert to cents
      const discount = 0;
      const subtotal = baseAmount - discount;
      const tax = Math.round(subtotal * TAX_RATE);
      const total = subtotal + tax;

      return {
        id: `li_${uuidv4()}`,
        item: {
          id: item.id,
          quantity: item.quantity,
        },
        base_amount: baseAmount,
        discount,
        subtotal,
        tax,
        total,
      };
    });

    // Calculate totals
    const itemsBaseAmount = lineItems.reduce((sum, li) => sum + li.base_amount, 0);
    const subtotal = lineItems.reduce((sum, li) => sum + li.subtotal, 0);
    const totalTax = lineItems.reduce((sum, li) => sum + li.tax, 0);
    const total = lineItems.reduce((sum, li) => sum + li.total, 0);

    const totals: ACPTotal[] = [
      {
        type: "items_base_amount",
        display_text: "Item(s) total",
        amount: itemsBaseAmount,
      },
      {
        type: "subtotal",
        display_text: "Subtotal",
        amount: subtotal,
      },
      {
        type: "tax",
        display_text: "Tax",
        amount: totalTax,
      },
      {
        type: "total",
        display_text: "Total",
        amount: total,
      },
    ];

    // Determine status
    const hasAddress = body.fulfillment_address && body.fulfillment_address.line_one;
    const status = hasAddress ? "ready_for_payment" : "not_ready_for_payment";

    // Create fulfillment options if address provided
    const fulfillmentOptions = hasAddress
      ? [
          {
            id: "standard",
            type: "shipping" as const,
            display_text: "Standard Shipping (5-7 business days)",
            amount: 500,
            selected: true,
            carrier: "USPS",
            service_level: "standard",
          },
          {
            id: "express",
            type: "shipping" as const,
            display_text: "Express Shipping (2-3 business days)",
            amount: 1500,
            carrier: "FedEx",
            service_level: "express",
          },
        ]
      : [];

    // Update totals with shipping if applicable
    if (fulfillmentOptions.length > 0) {
      const selectedShipping = fulfillmentOptions.find((opt) => opt.selected);
      if (selectedShipping) {
        totals.push({
          type: "shipping",
          display_text: "Shipping",
          amount: selectedShipping.amount,
        });
        // Update total
        const totalIndex = totals.findIndex((t) => t.type === "total");
        if (totalIndex !== -1) {
          totals[totalIndex].amount += selectedShipping.amount;
        }
      }
    }

    const session: CheckoutSession = {
      id: sessionId,
      payment_provider: {
        provider: "stripe",
        supported_payment_methods: ["card", "apple_pay", "google_pay"],
      },
      status,
      currency: "usd",
      line_items: lineItems,
      totals,
      fulfillment_options: fulfillmentOptions,
      buyer_email: body.buyer_email,
      buyer_phone: body.buyer_phone,
      fulfillment_address: body.fulfillment_address,
      links: [
        {
          type: "terms_of_use",
          url: "https://sonorathreads.com/terms",
        },
        {
          type: "privacy_policy",
          url: "https://sonorathreads.com/privacy",
        },
      ],
    };

    // Store session
    createSession(session);

    console.log("✅ Checkout session created:", sessionId);

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: String(error) },
      { status: 500 }
    );
  }
}
