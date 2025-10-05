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
    const systemPrompt = `You are Sonora, a warm and helpful shopping assistant for Sonora Threads. Keep responses brief (1-2 sentences) and conversational.

🛍️ PRODUCTS:
- Backpack: $110 - Durable laptop backpack
- Premium T-Shirt: $22 - Slim fit casual tee
- Cotton Jacket: $56 - Stylish outerwear
- Casual Shirt: $16 - Everyday comfort

💬 HOW TO RESPOND:

When user wants to ADD items:
- Format: "Great choice! [ADD_TO_CART:Product Name:price]"
- Be enthusiastic and confirm what you're adding
- Examples:
  • "Add the backpack" → "Perfect! Adding the Backpack to your cart! [ADD_TO_CART:Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops:110]"
  • "I want the jacket" → "Great pick! [ADD_TO_CART:Mens Cotton Jacket:56]"

When user wants to CHECKOUT:
- Format: "Taking you there! [NAVIGATE:checkout]"
- Be immediate and action-oriented
- Examples:
  • "Checkout" → "Let's complete your order! [NAVIGATE:checkout]"
  • "Take me to checkout" → "On it! [NAVIGATE:checkout]"
  • "I'm ready to pay" → "Perfect! [NAVIGATE:checkout]"
  • "Complete purchase" → "Taking you to checkout now! [NAVIGATE:checkout]"

🎯 RULES:
- ALWAYS include the action markers [ADD_TO_CART:...] or [NAVIGATE:checkout]
- Keep responses short and friendly
- Confirm actions enthusiastically
- Never ask "anything else?" - let conversation flow naturally`;
    
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

    // Parse cart actions from AI response
    const cartActionRegex = /\[ADD_TO_CART:([^:]+):(\d+)\]/g;
    const cartActions: Array<{action: string; itemName: string; price: number}> = [];
    let cleanedMessage = aiMessage;
    
    let match;
    while ((match = cartActionRegex.exec(aiMessage)) !== null) {
      cartActions.push({
        action: "add",
        itemName: match[1].trim(),
        price: parseInt(match[2])
      });
      // Remove the marker from the message
      cleanedMessage = cleanedMessage.replace(match[0], "");
    }

    console.log("🛒 Cart actions detected:", cartActions);

    // Parse navigation actions
    const navigationRegex = /\[NAVIGATE:([^\]]+)\]/g;
    let navigationAction: string | undefined;
    let navMatch;
    while ((navMatch = navigationRegex.exec(aiMessage)) !== null) {
      navigationAction = navMatch[1].trim();
      // Remove the marker from the message
      cleanedMessage = cleanedMessage.replace(navMatch[0], "");
    }

    console.log("🧭 Navigation action detected:", navigationAction);

    return NextResponse.json({
      response: cleanedMessage.trim(),
      cartActions: cartActions.length > 0 ? cartActions : undefined,
      navigationAction: navigationAction,
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
