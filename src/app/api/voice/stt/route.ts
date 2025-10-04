import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    // Note: ElevenLabs doesn't have STT yet, this is a placeholder
    // For now, we use browser's Web Speech API on the client
    // In production, you could use OpenAI Whisper or other STT services
    
    return NextResponse.json(
      { 
        text: "STT not implemented yet - using browser Web Speech API",
        note: "ElevenLabs focuses on TTS. Consider OpenAI Whisper for STT."
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error in /api/voice/stt:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
