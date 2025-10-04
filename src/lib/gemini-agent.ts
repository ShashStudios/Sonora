/**
 * Gemini AI Shopping Agent
 * The brain of Sonora's voice-first marketplace
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

export interface AgentContext {
  role: 'buyer' | 'seller';
  storeId?: string;
  conversationHistory?: Array<{ role: string; text: string }>;
  currentAction?: string;
  cart?: any[];
  products?: any[];
}

/**
 * Seller Agent - Guides sellers through store creation and product listing
 */
export async function sellerAgent(
  userMessage: string,
  context: AgentContext
): Promise<{ response: string; action?: any; nextStep?: string }> {
  if (!genAI) {
    return {
      response: "I'm ready to help you set up your store! However, the AI isn't configured yet. Please add GEMINI_API_KEY to your environment.",
      action: null,
    };
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const systemPrompt = `You are a helpful voice assistant helping a person with disabilities create their online store on Sonora, a voice-first marketplace.

Your role:
- Guide them through creating a store profile
- Help them add products via voice dialogue
- Ask clear, simple questions one at a time
- Be patient and encouraging
- Confirm information back to them
- Keep responses concise for voice output

Current context: ${JSON.stringify(context)}

When they describe a product:
1. Extract: product name, description, price, category
2. Ask clarifying questions if info is missing
3. Confirm details before saving

Respond in a warm, supportive tone. Keep it conversational.`;

  const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Parse for actions (product creation, store setup, etc.)
  const action = parseSellerAction(userMessage, response, context);

  return {
    response,
    action,
    nextStep: determineNextStep(context, action),
  };
}

/**
 * Buyer Agent - Helps buyers shop, search, and checkout with voice
 */
export async function buyerAgent(
  userMessage: string,
  context: AgentContext
): Promise<{ response: string; action?: any; products?: any[] }> {
  if (!genAI) {
    return {
      response: "I'm here to help you shop! However, the AI isn't configured yet. Please add GEMINI_API_KEY to your environment.",
      action: null,
    };
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const availableProducts = context.products || [];
  const cartItems = context.cart || [];

  const systemPrompt = `You are a helpful voice shopping assistant for Sonora, an accessible marketplace for people with disabilities.

Your role:
- Help users find products by voice
- Describe products clearly for screen readers
- Add items to cart when requested
- Guide through checkout process
- Be patient and clear

Available products: ${JSON.stringify(availableProducts.slice(0, 10))}
Current cart: ${JSON.stringify(cartItems)}

When user asks to find something:
1. Search available products
2. Describe 2-3 best matches verbally
3. Mention key details: name, price, description

When user says "add to cart" or "buy this":
- Confirm which product
- Add to cart
- State cart total

Keep responses SHORT and CLEAR for voice output.

User: ${userMessage}

Assistant:`;

  const prompt = systemPrompt;
  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Parse for shopping actions
  const action = parseBuyerAction(userMessage, response, context);

  return {
    response,
    action,
    products: action?.type === 'search' ? action.results : undefined,
  };
}

/**
 * Parse seller actions from conversation
 */
function parseSellerAction(userMessage: string, aiResponse: string, context: AgentContext) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Detect product creation intent
  if (lowerMessage.includes('create') || lowerMessage.includes('add product') || lowerMessage.includes('new product')) {
    return { type: 'create_product_start' };
  }
  
  // Detect product details being provided
  const priceMatch = userMessage.match(/\$(\d+(?:\.\d{2})?)|price.*?(\d+)/);
  if (priceMatch) {
    return {
      type: 'product_detail',
      field: 'price',
      value: priceMatch[1] || priceMatch[2],
    };
  }
  
  return null;
}

/**
 * Parse buyer actions from conversation
 */
function parseBuyerAction(userMessage: string, aiResponse: string, context: AgentContext) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Search intent
  if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking for')) {
    return {
      type: 'search',
      query: userMessage,
      results: context.products || [],
    };
  }
  
  // Add to cart intent
  if (lowerMessage.includes('add to cart') || lowerMessage.includes('add this') || lowerMessage.includes('buy this')) {
    return {
      type: 'add_to_cart',
      product: context.products?.[0], // Most relevant product
    };
  }
  
  // Checkout intent
  if (lowerMessage.includes('checkout') || lowerMessage.includes('complete purchase') || lowerMessage.includes('buy now')) {
    return {
      type: 'checkout',
      cart: context.cart,
    };
  }
  
  return null;
}

/**
 * Determine next step in seller flow
 */
function determineNextStep(context: AgentContext, action: any): string | undefined {
  if (!action) return undefined;
  
  if (action.type === 'create_product_start') {
    return 'ask_product_name';
  }
  
  if (action.type === 'product_detail') {
    if (!context.currentAction) return 'ask_description';
    return 'ask_more_details';
  }
  
  return undefined;
}
