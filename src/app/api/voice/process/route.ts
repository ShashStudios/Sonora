import { NextRequest, NextResponse } from 'next/server';
import { speakMessage } from '@/lib/elevenlabs';
import { buyerAgent } from '@/lib/gemini-agent';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { text, storeId, cart } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Fetch available products for context
    const products = await db.product.findMany({
      where: storeId ? { storeId } : undefined,
      take: 20,
    });

    // Use Gemini agent for intelligent conversation
    const agentResponse = await buyerAgent(text, {
      role: 'buyer',
      storeId,
      products,
      cart: cart || [],
    });

    // Generate voice response with ElevenLabs
    const voiceResult = await speakMessage(agentResponse.response);

    return NextResponse.json({
      success: true,
      message: agentResponse.response,
      audioUrl: voiceResult.audioUrl,
      action: agentResponse.action,
      products: agentResponse.products,
    });
  } catch (error: any) {
    console.error('Voice processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process voice command' },
      { status: 500 }
    );
  }
}
