/**
 * OpenAI Agentic Commerce Protocol (ACP) Integration
 * 
 * Implements the official ACP specification for instant checkout
 * Reference: https://platform.openai.com/docs/guides/agentic-commerce
 */

const ACP_API_KEY = process.env.ACP_API_KEY;
const ACP_BASE_URL = process.env.ACP_BASE_URL || 'https://api.openai.com/v1/agentic';

// ACP Types based on the official spec
export interface ACPProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface ACPCartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ACPCheckoutRequest {
  merchantId: string;
  items: ACPCartItem[];
  totalAmount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  metadata?: Record<string, unknown>;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface ACPCheckoutResponse {
  orderId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  checkoutUrl?: string;
  paymentIntent?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ACPOrderStatus {
  orderId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  totalAmount: number;
  currency: string;
  items: ACPCartItem[];
  paymentStatus?: string;
  shippingStatus?: string;
  updatedAt: string;
}

/**
 * Initialize an ACP checkout session
 * This is the core method for instant checkout
 */
export async function initiateCheckout(
  request: ACPCheckoutRequest
): Promise<ACPCheckoutResponse> {
  if (!ACP_API_KEY) {
    throw new Error('ACP_API_KEY not configured');
  }

  const response = await fetch(`${ACP_BASE_URL}/checkout/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACP_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ACP checkout failed: ${error}`);
  }

  return response.json();
}

/**
 * Complete an ACP checkout session
 * Called after payment confirmation
 */
export async function completeCheckout(
  orderId: string,
  paymentData?: Record<string, unknown>
): Promise<ACPOrderStatus> {
  if (!ACP_API_KEY) {
    throw new Error('ACP_API_KEY not configured');
  }

  const response = await fetch(
    `${ACP_BASE_URL}/checkout/sessions/${orderId}/complete`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentData }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ACP checkout completion failed: ${error}`);
  }

  return response.json();
}

/**
 * Get order status by ACP order ID
 */
export async function getOrderStatus(orderId: string): Promise<ACPOrderStatus> {
  if (!ACP_API_KEY) {
    throw new Error('ACP_API_KEY not configured');
  }

  const response = await fetch(`${ACP_BASE_URL}/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${ACP_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch order status: ${error}`);
  }

  return response.json();
}

/**
 * Cancel an ACP order
 */
export async function cancelOrder(
  orderId: string,
  reason?: string
): Promise<ACPOrderStatus> {
  if (!ACP_API_KEY) {
    throw new Error('ACP_API_KEY not configured');
  }

  const response = await fetch(`${ACP_BASE_URL}/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACP_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to cancel order: ${error}`);
  }

  return response.json();
}

/**
 * Verify ACP webhook signature
 * For secure webhook handling
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Implementation depends on ACP's signing algorithm
  // Typically HMAC-SHA256
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Handle ACP webhook events
 */
export interface ACPWebhookEvent {
  id: string;
  type: 'order.created' | 'order.completed' | 'order.failed' | 'order.cancelled';
  data: ACPOrderStatus;
  timestamp: string;
}

export async function handleWebhookEvent(
  event: ACPWebhookEvent
): Promise<void> {
  // Process different event types
  switch (event.type) {
    case 'order.created':
      console.log('New ACP order created:', event.data.orderId);
      break;
    case 'order.completed':
      console.log('ACP order completed:', event.data.orderId);
      break;
    case 'order.failed':
      console.log('ACP order failed:', event.data.orderId);
      break;
    case 'order.cancelled':
      console.log('ACP order cancelled:', event.data.orderId);
      break;
    default:
      console.warn('Unknown ACP event type:', event.type);
  }
}

/**
 * Create a voice-optimized checkout flow
 * Simplified for voice commands
 */
export async function voiceCheckout(params: {
  storeId: string;
  cartItems: Array<{ productId: string; quantity: number; price: number }>;
  customerEmail?: string;
  customerName?: string;
}): Promise<ACPCheckoutResponse> {
  const totalAmount = params.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkoutRequest: ACPCheckoutRequest = {
    merchantId: params.storeId,
    items: params.cartItems,
    totalAmount,
    currency: 'USD',
    customerEmail: params.customerEmail,
    customerName: params.customerName,
    metadata: {
      voiceCheckout: true,
      timestamp: new Date().toISOString(),
    },
  };

  return initiateCheckout(checkoutRequest);
}
