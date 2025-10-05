import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/db';
import { speakMessage } from '@/lib/elevenlabs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

/**
 * Sonora Agent - Main processing endpoint
 * Uses Gemini to understand user intent and take actions
 */
export async function POST(request: NextRequest) {
  try {
    const { userMessage, context } = await request.json();

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!genAI) {
      return NextResponse.json({
        response: "I'm Sonora, but I need the Gemini API to understand you better. Please add GEMINI_API_KEY to your environment.",
        audioUrl: null,
        action: null,
      });
    }

    // Fetch relevant data based on context
    const products = await db.product.findMany({
      take: 20,
      where: { inStock: true },
      orderBy: { createdAt: 'desc' },
    });

    const stores = await db.store.findMany({
      take: 10,
    });

    // Build conversation context for Gemini
    console.log('🧠 ============ GEMINI AI CALL START ============');
    console.log('📝 User message:', userMessage);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are Sonora, a voice shopping assistant for people with disabilities.

User said: "${userMessage}"

Available products in database:
${JSON.stringify(products.slice(0, 10).map(p => ({name: p.name, price: p.price})))}

Context from previous searches:
${context?.lastSearchResults ? JSON.stringify(context.lastSearchResults.map((p: any) => ({name: p.name, price: p.price}))) : 'None'}

Your task:
1. Understand what the user wants
2. Respond conversationally in 1-2 sentences
3. If they're searching for products, describe what you found
4. If they're adding to cart, confirm the EXACT product they just searched for (from context)

Examples:
- User: "find me headphones under $100"
  Response: "I found 2 headphones under $100. The Premium Wireless Headphones are $79.99 with great sound quality. Would you like to add one to your cart?"
  
- User: "add to cart" (after searching for mechanical keyboard)
  Response: "Added the Mechanical Keyboard for $69.99 to your cart!"

- User: "show me the marketplace"
  Response: "Taking you to the marketplace now."

Keep it SHORT, CLEAR, and HELPFUL. When adding to cart, confirm the product from the LAST SEARCH, not a random product.`;

    console.log('🔮 Calling Gemini API...');
    const result = await model.generateContent(systemPrompt);
    const aiResponse = result.response.text();
    
    console.log('✅ Gemini Response:', aiResponse);
    console.log('🧠 ============ GEMINI AI CALL END ============');

    // Parse response and action
    console.log('🔧 Parsing AI response and inferring action...');
    const { response, action } = parseAIResponse(aiResponse, userMessage, products, context);
    console.log('📋 Parsed response:', response);
    console.log('🎬 Inferred action:', action);

    // If searching, enhance response with product details
    let finalResponse = response;
    if (action?.type === 'search_products' && action.results?.length > 0) {
      const topProducts = action.results.slice(0, 3);
      finalResponse = `I found ${action.results.length} products. `;
      topProducts.forEach((p, i) => {
        finalResponse += `${i + 1}. ${p.name} for $${p.price}. `;
      });
      finalResponse += `Would you like me to add any to your cart?`;
    } else if (action?.type === 'search_products' && action.results?.length === 0) {
      finalResponse = `I couldn't find any products matching "${action.query}". Try browsing the marketplace to see all available items.`;
    }

    // Generate voice with ElevenLabs
    const voiceResult = await speakMessage(finalResponse);

    // Update context based on action
    const updatedContext = updateContext(context, action);

    return NextResponse.json({
      response: finalResponse,
      audioUrl: voiceResult.audioUrl,
      action,
      updatedContext,
    });
  } catch (error: any) {
    console.error('Sonora processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process' },
      { status: 500 }
    );
  }
}

/**
 * Parse AI response to extract spoken text and action
 */
function parseAIResponse(aiText: string, userMessage: string, products: any[], context: any) {
  let response = aiText;
  let action = null;

  // Try to extract structured response
  const responseMatch = aiText.match(/RESPONSE:\s*(.+?)(?=ACTION:|$)/s);
  const actionMatch = aiText.match(/ACTION:\s*(.+)/s);

  if (responseMatch) {
    response = responseMatch[1].trim();
  }

  if (actionMatch) {
    try {
      const actionText = actionMatch[1].trim();
      if (actionText.toLowerCase() !== 'null') {
        action = JSON.parse(actionText);
      }
    } catch (e) {
      // Couldn't parse action, infer from user message
      action = inferAction(userMessage, products, context);
    }
  } else {
    // No explicit action, try to infer
    action = inferAction(userMessage, products, context);
  }

  return { response, action };
}

/**
 * Infer action from user message
 */
function inferAction(userMessage: string, products: any[], context: any) {
  const lower = userMessage.toLowerCase();

  if (lower.includes('marketplace') || lower.includes('browse') || lower.includes('stores')) {
    return { type: 'navigate', url: '/marketplace' };
  }

  if (lower.includes('sell') || lower.includes('create store') || lower.includes('become seller')) {
    return { type: 'navigate', url: '/seller/voice-onboard' };
  }

  if (lower.includes('find') || lower.includes('search') || lower.includes('looking for') || lower.includes('headphones') || lower.includes('hoodie') || lower.includes('keyboard') || lower.includes('laptop')) {
    // Extract search terms and price filter
    let query = userMessage
      .replace(/find me|search for|looking for|show me|find|get me/gi, '')
      .replace(/\ba\b|\bthe\b|\ban\b/gi, '') // Remove articles
      .replace(/[.,!?;:]/g, '') // Remove punctuation
      .trim();
    
    console.log('🔍 Original query:', userMessage);
    console.log('🔍 Cleaned query:', query);
    
    // Extract price if mentioned
    const priceMatch = userMessage.match(/under\s+\$?(\d+)/i);
    const maxPrice = priceMatch ? parseInt(priceMatch[1]) : null;
    
    // Fuzzy search - split query into words and check if any match
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    // Filter products with fuzzy matching
    let filtered = products.filter(p => {
      const productName = p.name.toLowerCase();
      const productDesc = (p.description || '').toLowerCase();
      
      // Check if any query word appears in product name or description
      const matchesQuery = queryWords.length === 0 || queryWords.some(word => 
        productName.includes(word) || productDesc.includes(word)
      );
      
      const matchesPrice = !maxPrice || p.price <= maxPrice;
      
      return matchesQuery && matchesPrice;
    });
    
    // Sort by relevance - prioritize name matches over description matches
    filtered.sort((a, b) => {
      const aNameMatches = queryWords.filter(w => a.name.toLowerCase().includes(w)).length;
      const bNameMatches = queryWords.filter(w => b.name.toLowerCase().includes(w)).length;
      return bNameMatches - aNameMatches;
    });
    
    console.log('🔍 Query words:', queryWords);
    console.log('🔍 Found products:', filtered.map(p => p.name));
    
    return { 
      type: 'search_products', 
      query,
      maxPrice,
      results: filtered.slice(0, 5)
    };
  }

  if (lower.includes('add') && (lower.includes('cart') || lower.includes('basket') || lower.includes('card'))) {
    // Add first product from last search results
    const product = context?.lastSearchResults?.[0];
    console.log('🛒 Add to cart - last search results:', context?.lastSearchResults?.map((p: any) => p.name));
    console.log('🛒 Adding product:', product?.name);
    
    if (!product) {
      console.log('⚠️ No product in context, using first available');
      return { type: 'add_to_cart', product: products[0] };
    }
    
    return { type: 'add_to_cart', product };
  }

  if (lower.includes('checkout') || lower.includes('buy now') || lower.includes('purchase')) {
    return { type: 'checkout' };
  }

  // Recognize "cart", "basket", or "card" (common STT mistake)
  if (lower.includes('cart') || lower.includes('basket') || lower.includes('card') || lower.includes('my shopping')) {
    return { type: 'view_cart' };
  }

  return null;
}

/**
 * Update session context based on action
 */
function updateContext(currentContext: any, action: any) {
  if (!action) return currentContext;

  const updated = { ...currentContext };

  if (action.type === 'add_to_cart' && action.product) {
    updated.cart = [...(updated.cart || []), action.product];
  }

  if (action.type === 'search_products') {
    updated.lastQuery = action.query;
  }

  return updated;
}
