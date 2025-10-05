import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  return NextResponse.json({
    acp_version: "draft-2025-09",
    merchant: {
      name: "Sonora Threads",
      description: "Voice-native shopping with AI-powered assistance",
      region: "US",
      website: baseUrl,
      support_email: "support@sonorathreads.com",
    },
    endpoints: {
      checkout_sessions: `${baseUrl}/api/acp/checkout_sessions`,
      checkout_session: `${baseUrl}/api/acp/checkout_sessions/{checkout_session_id}`,
      complete_checkout: `${baseUrl}/api/acp/checkout_sessions/{checkout_session_id}/complete`,
      cancel_checkout: `${baseUrl}/api/acp/checkout_sessions/{checkout_session_id}/cancel`,
    },
    feeds: {
      products: {
        json: `${baseUrl}/api/feed/products.json`,
        xml: `${baseUrl}/api/feed/products.xml`,
      },
    },
    payment_providers: [
      {
        provider: "stripe",
        supported_methods: ["card", "apple_pay", "google_pay", "link"],
      },
    ],
    capabilities: [
      "instant_checkout",
      "voice_ordering",
      "real_time_inventory",
      "flexible_shipping",
    ],
  });
}
