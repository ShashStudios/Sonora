/**
 * Shared TypeScript types for Sonora
 */

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  voiceDescription?: string | null;
  category?: string | null;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Store {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  stripeAccountId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  storeId: string;
  buyerEmail: string;
  buyerName?: string | null;
  totalAmount: number;
  status: string;
  acpOrderId?: string | null;
  stripePaymentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Cart {
  id: string;
  sessionId: string;
  storeId: string;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface VoiceCommand {
  command: string;
  intent: 'search' | 'add_to_cart' | 'checkout' | 'help' | 'navigate';
  params?: Record<string, unknown>;
}

export interface AccessibilitySettings {
  captions: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}
