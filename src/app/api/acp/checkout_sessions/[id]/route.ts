import { NextRequest, NextResponse } from "next/server";
import { UpdateCheckoutSessionRequest, CheckoutSession, ACPLineItem, ACPTotal } from "@/lib/acp-types";
import { getSession, updateSession } from "@/lib/session-store";
import { getProducts } from "@/lib/products";
import { v4 as uuidv4 } from "uuid";

const TAX_RATE = 0.10;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = getSession(id);

    if (!session) {
      return NextResponse.json(
        { error: "Checkout session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("❌ Error getting checkout session:", error);
    return NextResponse.json(
      { error: "Failed to get checkout session" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateCheckoutSessionRequest = await req.json();
    
    console.log("🔄 Updating checkout session:", id, body);

    const session = getSession(id);
    if (!session) {
      return NextResponse.json(
        { error: "Checkout session not found" },
        { status: 404 }
      );
    }

    // Update items if provided
    if (body.items) {
      // Fetch products from API
      const products = await getProducts();
      
      const lineItems: ACPLineItem[] = body.items.map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
        }

        const baseAmount = product.price * 100 * item.quantity;
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

      session.line_items = lineItems;
    }

    // Update buyer info
    if (body.buyer_email !== undefined) {
      session.buyer_email = body.buyer_email;
    }
    if (body.buyer_phone !== undefined) {
      session.buyer_phone = body.buyer_phone;
    }
    if (body.fulfillment_address !== undefined) {
      session.fulfillment_address = body.fulfillment_address;
    }

    // Update fulfillment options
    const hasAddress = session.fulfillment_address && session.fulfillment_address.line_one;
    if (hasAddress && session.fulfillment_options.length === 0) {
      session.fulfillment_options = [
        {
          id: "standard",
          type: "shipping",
          display_text: "Standard Shipping (5-7 business days)",
          amount: 500,
          selected: true,
          carrier: "USPS",
          service_level: "standard",
        },
        {
          id: "express",
          type: "shipping",
          display_text: "Express Shipping (2-3 business days)",
          amount: 1500,
          carrier: "FedEx",
          service_level: "express",
        },
      ];
    }

    // Update selected fulfillment option
    if (body.selected_fulfillment_option_id) {
      session.selected_fulfillment_option_id = body.selected_fulfillment_option_id;
      session.fulfillment_options = session.fulfillment_options.map((opt) => ({
        ...opt,
        selected: opt.id === body.selected_fulfillment_option_id,
      }));
    }

    // Recalculate totals
    const itemsBaseAmount = session.line_items.reduce((sum, li) => sum + li.base_amount, 0);
    const subtotal = session.line_items.reduce((sum, li) => sum + li.subtotal, 0);
    const totalTax = session.line_items.reduce((sum, li) => sum + li.tax, 0);
    let total = session.line_items.reduce((sum, li) => sum + li.total, 0);

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
    ];

    // Add shipping to totals if applicable
    const selectedShipping = session.fulfillment_options.find((opt) => opt.selected);
    if (selectedShipping) {
      totals.push({
        type: "shipping",
        display_text: "Shipping",
        amount: selectedShipping.amount,
      });
      total += selectedShipping.amount;
    }

    totals.push({
      type: "total",
      display_text: "Total",
      amount: total,
    });

    session.totals = totals;

    // Update status
    const isReadyForPayment = 
      hasAddress && 
      session.buyer_email && 
      session.fulfillment_options.length > 0;
    
    session.status = isReadyForPayment ? "ready_for_payment" : "not_ready_for_payment";

    // Update session
    updateSession(id, session);

    console.log("✅ Checkout session updated:", id);

    return NextResponse.json(session);
  } catch (error) {
    console.error("❌ Error updating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to update checkout session", details: String(error) },
      { status: 500 }
    );
  }
}
