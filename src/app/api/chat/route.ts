import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log("🔑 Gemini API Key present:", !!apiKey);
    
    if (!apiKey) {
      console.error("❌ Missing GEMINI_API_KEY");
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Build conversation context for Gemini
    const systemPrompt = "You are Sonora, a helpful and friendly shopping voice assistant. Keep responses concise (1-2 sentences max) for natural conversation flow. Be conversational and helpful.";
    
    // Convert conversation history to Gemini format
    const contents = [];
    
    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        if (msg.role === "user") {
          contents.push({
            role: "user",
            parts: [{ text: msg.content }]
          });
        } else if (msg.role === "assistant") {
          contents.push({
            role: "model",
            parts: [{ text: msg.content }]
          });
        }
      }
    }
    
    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    console.log("📡 Calling Gemini API");

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      }),
    });

    console.log("📊 Gemini response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gemini API error:", errorText);
      console.error("❌ Response status:", response.status);
      return NextResponse.json(
        { error: "Failed to get AI response", details: errorText, status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("📦 Full Gemini response:", JSON.stringify(data, null, 2));
    
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    console.log("💬 AI Message:", aiMessage);

    if (!aiMessage || aiMessage.trim() === "") {
      console.error("⚠️ Empty response from Gemini");
      return NextResponse.json({
        response: "I'm here to help! Could you please rephrase that?",
        conversationHistory: [
          ...(conversationHistory || []),
          { role: "user", content: message },
          { role: "assistant", content: "I'm here to help! Could you please rephrase that?" }
        ]
      });
    }

    return NextResponse.json({
      response: aiMessage,
      conversationHistory: [
        ...(conversationHistory || []),
        { role: "user", content: message },
        { role: "assistant", content: aiMessage }
      ]
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
