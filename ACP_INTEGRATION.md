# Agentic Commerce Protocol Integration

## Overview

This application now fully integrates with the **OpenAI Agentic Commerce Protocol (ACP)** and Stripe for seamless voice-based shopping and checkout.

## Features Implemented

### 1. Voice Shopping with Cart
- Users can say "add the hoodie to cart" and items are automatically added
- Real-time cart updates with visual feedback
- Sliding cart sidebar with quantity controls

### 2. ACP Endpoints
All required ACP endpoints have been implemented:

- **Discovery**: `/.well-known/agentic-commerce.json` - Advertises merchant info and endpoints
- **Create Session**: `POST /api/acp/checkout_sessions` - Creates new checkout with line items and totals
- **Update Session**: `POST /api/acp/checkout_sessions/{id}` - Updates cart, shipping, buyer info
- **Complete Checkout**: `POST /api/acp/checkout_sessions/{id}/complete` - Processes payment via Stripe
- **Cancel Session**: `POST /api/acp/checkout_sessions/{id}/cancel` - Cancels the checkout
- **Get Session**: `GET /api/acp/checkout_sessions/{id}` - Retrieves session details

### 3. Stripe Payment Integration
- Stripe Elements for secure payment collection
- Payment Intents API for processing charges
- Support for cards, Apple Pay, Google Pay
- PCI-compliant payment handling

### 4. Full Checkout Flow
1. **Shop Page**: Voice conversation adds items to cart
2. **Cart**: Review items, adjust quantities, see total
3. **Checkout Page**: Secure Stripe payment form
4. **Success Page**: Order confirmation with order ID

## How It Works

### Voice-to-Cart Flow
```
User: "Add the black hoodie to cart"
  ↓
Gemini AI detects intent
  ↓
Returns: [ADD_TO_CART:Soft Black Hoodie:32]
  ↓
Frontend parses marker and calls addItem()
  ↓
Cart updates immediately
```

### Checkout Flow
```
Cart → Click "Proceed to Checkout"
  ↓
POST /api/acp/checkout_sessions
  ↓
Session created with line items, tax, shipping
  ↓
Stripe PaymentIntent created
  ↓
User enters payment info
  ↓
POST /api/acp/checkout_sessions/{id}/complete
  ↓
Stripe charges payment method
  ↓
Order ID generated
  ↓
Redirect to success page
```

## Testing

### Test the Cart
1. Go to `/shop`
2. Click the black dot to start conversation
3. Say: "Add the beanie and hoodie to my cart"
4. Click the cart icon (top right) to see items

### Test Checkout
1. Ensure items are in cart
2. Click "Proceed to Checkout"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Any future date, any CVC
5. Complete payment

### Test ACP Endpoints
```bash
# Create session
curl -X POST http://localhost:3000/api/acp/checkout_sessions \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": "hoodie", "quantity": 1}],
    "buyer_email": "test@example.com",
    "fulfillment_address": {
      "name": "Test User",
      "line_one": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94131",
      "country": "US"
    }
  }'

# Get session
curl http://localhost:3000/api/acp/checkout_sessions/{session_id}
```

## Environment Variables Required

```bash
# Required in .env.local
GEMINI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Architecture

### Frontend
- **Cart Context**: Global state management for cart items
- **Shop Page**: Voice interface with real-time cart updates
- **Checkout Page**: Stripe Elements integration
- **Success Page**: Order confirmation

### Backend
- **ACP Routes**: Full implementation of Agentic Commerce Protocol
- **Session Store**: In-memory storage (replace with Redis/DB for production)
- **Stripe Integration**: Payment processing with proper error handling

### AI Integration
- **Gemini AI**: Detects purchase intent from voice
- **Marker System**: `[ADD_TO_CART:Product:Price]` for structured actions
- **Context Preservation**: Maintains conversation history

## Production Readiness

### To Do for Production:
- [ ] Replace in-memory session store with Redis/PostgreSQL
- [ ] Add webhook endpoint for order status updates
- [ ] Implement proper authentication/authorization for ACP endpoints
- [ ] Add rate limiting
- [ ] Set up monitoring and logging
- [ ] Add fraud detection
- [ ] Implement proper inventory management
- [ ] Add email notifications
- [ ] Set up proper error handling and retry logic
- [ ] Add unit and integration tests

## Compliance

✅ Implements ACP Checkout Spec v1
✅ PCI-compliant via Stripe
✅ Secure HTTPS required for all endpoints
✅ Idempotency support via headers
✅ Proper error codes and messages
✅ Status tracking (not_ready_for_payment → ready_for_payment → completed)

## Support

For issues or questions about the ACP integration:
- ACP Docs: https://developers.openai.com/commerce
- Stripe Docs: https://docs.stripe.com/agentic-commerce
- This implementation: See code comments in `/src/app/api/acp/`
