import { NextRequest, NextResponse } from 'next/server';
import { speakMessage } from '@/lib/elevenlabs';
import { sellerAgent } from '@/lib/gemini-agent';
import { db } from '@/lib/db';

/**
 * Voice-driven seller onboarding
 * Guides sellers through store creation via conversation
 */
export async function POST(request: NextRequest) {
  try {
    const { text, context } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Use seller agent for conversation
    const agentResponse = await sellerAgent(text, {
      role: 'seller',
      ...context,
    });

    // Generate voice response
    const voiceResult = await speakMessage(agentResponse.response);

    return NextResponse.json({
      success: true,
      message: agentResponse.response,
      audioUrl: voiceResult.audioUrl,
      action: agentResponse.action,
      nextStep: agentResponse.nextStep,
    });
  } catch (error: any) {
    console.error('Seller voice onboarding error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process' },
      { status: 500 }
    );
  }
}
