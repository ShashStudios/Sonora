import { NextRequest, NextResponse } from 'next/server';
import { speakMessage } from '@/lib/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const result = await speakMessage(text);

    return NextResponse.json({
      success: true,
      audioUrl: result.audioUrl,
      audioBase64: result.audioBase64,
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
