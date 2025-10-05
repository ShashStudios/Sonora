// Agentic Commerce Protocol Types

export interface ACPItem {
  id: string;
  quantity: number;
}

export interface ACPAddress {
  name?: string;
  line_one?: string;
  line_two?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface ACPLineItem {
  id: string;
  item: ACPItem;
  base_amount: number;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface ACPTotal {
  type: "items_base_amount" | "subtotal" | "tax" | "shipping" | "discount" | "total";
  display_text: string;
  amount: number;
}

export interface ACPFulfillmentOption {
  id: string;
  type: "shipping" | "digital";
  display_text: string;
  amount: number;
  selected?: boolean;
  carrier?: string;
  service_level?: string;
  min_delivery_date?: string;
  max_delivery_date?: string;
}

export interface ACPMessage {
  type: "info" | "error";
  code?: string;
  path?: string;
  content_type: "plain" | "markdown";
  content: string;
}

export interface ACPLink {
  type: "terms_of_use" | "privacy_policy" | "returns_policy";
  url: string;
}

export interface ACPPaymentProvider {
  provider: "stripe";
  supported_payment_methods: string[];
}

export interface ACPPaymentData {
  stripe_payment_method_id?: string;
}

export type CheckoutStatus = "not_ready_for_payment" | "ready_for_payment" | "completed" | "canceled";

export interface CheckoutSession {
  id: string;
  payment_provider: ACPPaymentProvider;
  status: CheckoutStatus;
  currency: string;
  line_items: ACPLineItem[];
  totals: ACPTotal[];
  fulfillment_options: ACPFulfillmentOption[];
  messages?: ACPMessage[];
  links?: ACPLink[];
  buyer_email?: string;
  buyer_phone?: string;
  fulfillment_address?: ACPAddress;
  selected_fulfillment_option_id?: string;
  order_id?: string;
  payment_data?: ACPPaymentData;
}

export interface CreateCheckoutSessionRequest {
  items: ACPItem[];
  buyer_email?: string;
  buyer_phone?: string;
  fulfillment_address?: ACPAddress;
}

export interface UpdateCheckoutSessionRequest {
  items?: ACPItem[];
  buyer_email?: string;
  buyer_phone?: string;
  fulfillment_address?: ACPAddress;
  selected_fulfillment_option_id?: string;
}

export interface CompleteCheckoutSessionRequest {
  payment_data: ACPPaymentData;
}
