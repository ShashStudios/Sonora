import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

/**
 * ElevenLabs Speech-to-Text (STT)
 * Transcribe user voice input
 */
export async function POST(request: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // Convert to buffer for ElevenLabs
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call ElevenLabs STT API - they expect 'file' parameter, not 'audio'
    const elevenLabsFormData = new FormData();
    const blob = new Blob([buffer], { type: 'audio/webm' });
    elevenLabsFormData.append('file', blob, 'audio.webm');
    elevenLabsFormData.append('model_id', 'scribe_v1');

    console.log('📤 Sending to ElevenLabs STT...');

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: elevenLabsFormData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ ElevenLabs STT error:', error);
      return NextResponse.json(
        { error: 'Transcription failed: ' + error },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Clean up transcription - remove background noise markers and extra text
    let cleanedText = data.text || '';
    cleanedText = cleanedText
      .replace(/\(background noise\)/gi, '')
      .replace(/\(Background noise\)/gi, '')
      .replace(/\(.*?\)/g, '') // Remove any text in parentheses
      .replace(/\[.*?\]/g, '') // Remove any text in brackets
      .trim();
    
    console.log('✅ Original:', data.text);
    console.log('✅ Cleaned:', cleanedText);

    return NextResponse.json({
      success: true,
      text: cleanedText,
    });
  } catch (error: any) {
    console.error('STT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
