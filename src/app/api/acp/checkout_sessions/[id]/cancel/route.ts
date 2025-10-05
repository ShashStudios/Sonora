import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/session-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log("❌ Canceling checkout session:", id);

    const session = getSession(id);
    if (!session) {
      return NextResponse.json(
        { error: "Checkout session not found" },
        { status: 404 }
      );
    }

    session.status = "canceled";
    updateSession(id, session);

    console.log("✅ Checkout session canceled:", id);

    return NextResponse.json(session);
  } catch (error) {
    console.error("❌ Error canceling checkout session:", error);
    return NextResponse.json(
      { error: "Failed to cancel checkout session" },
      { status: 500 }
    );
  }
}
