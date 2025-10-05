# 🛍️ Sonora Threads - Voice-Native Shopping with AI

**An intelligent voice shopping assistant powered by Google Gemini AI, integrated with OpenAI's Agentic Commerce Protocol and Stripe payments.**

Built for HarvardHacks - A next-generation e-commerce experience where you can shop entirely through natural voice conversations.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Integrated-green)](https://stripe.com/)

---

## ✨ Features

### 🎙️ **Voice Shopping**
- Natural conversation with AI assistant "Sonora"
- Real-time speech recognition and text-to-speech
- Context-aware product recommendations
- Hands-free shopping experience

### 🛒 **Smart Cart Management**
- Voice-activated cart actions: "Add the backpack to my cart"
- Real-time cart updates with visual feedback
- Sliding cart sidebar with quantity controls
- Persistent cart state across sessions

### 💳 **Seamless Checkout**
- Voice command: "Take me to checkout"
- Stripe payment integration with test mode
- Support for cards, Apple Pay, Google Pay
- Order confirmation with unique order ID

### 🏪 **Real Product Catalog**
- Live product data from FakeStore API
- Real images, prices, and descriptions
- Customer ratings and reviews
- Auto-updating product feed

### 🤖 **OpenAI ACP Integration**
- Full Agentic Commerce Protocol implementation
- Product feed (JSON & XML)
- Checkout session management
- Payment intent processing
- ChatGPT Instant Checkout ready

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Stripe account (for payments)
- Google Gemini API key
- ElevenLabs API key (for voice)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sonora-threads.git
cd sonora-threads

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see below)

# Run development server
npm run dev
```

Visit **http://localhost:3000**

---

## 🔑 Environment Setup

Create a `.env.local` file with the following:

```bash
# Gemini AI (Required)
GEMINI_API_KEY=your_gemini_api_key

# ElevenLabs TTS (Required)
ELEVENLABS_API_KEY=your_elevenlabs_key

# Stripe Payments (Required for checkout)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clerk Auth (Pre-configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### Get Your API Keys:
- **Gemini**: https://aistudio.google.com/app/apikey
- **ElevenLabs**: https://elevenlabs.io/app/settings/api-keys
- **Stripe**: https://dashboard.stripe.com/test/apikeys

See `STRIPE_SETUP.md` for detailed Stripe configuration.

---

## 🎯 Usage

### **Basic Shopping Flow**

1. **Start Conversation**
   - Click the black dot on the shop page
   - Status shows: "🎙️ I'm listening!"

2. **Add Items**
   ```
   You: "Add the backpack to my cart"
   AI: "Perfect! Adding the Backpack to your cart!"
   ```

3. **Go to Checkout**
   ```
   You: "Take me to checkout"
   AI: "Taking you to checkout now!"
   ```

4. **Complete Payment**
   - Enter test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - Click "Pay Now"

5. **Order Confirmation**
   - See success page with Order ID
   - Cart automatically cleared

### **Voice Commands**

**Adding Items:**
- "Add the [product] to cart"
- "I want the [product]"
- "Get me the [product]"

**Checkout:**
- "Checkout"
- "Take me to checkout"
- "I'm ready to pay"
- "Complete my purchase"

**Cart Management:**
- Click cart icon (top-right) to view
- Use +/- buttons to adjust quantities
- Click trash icon to remove items

See `USAGE_GUIDE.md` for detailed examples.

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Clerk
- **AI**: Google Gemini API
- **Voice**: ElevenLabs TTS + Web Speech API
- **Payments**: Stripe Elements
- **Product Data**: FakeStore API

### Project Structure
```
sonora-threads/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── acp/              # ACP endpoints
│   │   │   │   └── checkout_sessions/
│   │   │   ├── chat/             # AI chat endpoint
│   │   │   ├── feed/             # Product feeds
│   │   │   └── voice/            # TTS/STT
│   │   ├── checkout/             # Checkout page
│   │   ├── shop/                 # Main shopping page
│   │   └── .well-known/          # ACP discovery
│   ├── contexts/
│   │   └── CartContext.tsx       # Global cart state
│   └── lib/
│       ├── acp-types.ts          # ACP TypeScript types
│       ├── products.ts           # Product data & API
│       ├── session-store.ts      # Session management
│       └── stripe.ts             # Stripe integration
├── .env.local                    # Environment variables
└── package.json
```

### Key Components

**CartContext** - Global state management for shopping cart
- Add/remove items
- Update quantities
- Calculate totals
- Persist across pages

**Shop Page** - Main voice interface
- Voice recognition (Web Speech API)
- AI conversation (Gemini)
- Text-to-speech (ElevenLabs)
- Real-time cart updates

**ACP Endpoints** - OpenAI Commerce Protocol
- `POST /api/acp/checkout_sessions` - Create session
- `POST /api/acp/checkout_sessions/{id}` - Update session
- `POST /api/acp/checkout_sessions/{id}/complete` - Process payment
- `GET /.well-known/agentic-commerce.json` - Discovery

---

## 🧪 Testing

### Test Cards (Stripe)
| Card Number         | Scenario           |
|--------------------|--------------------|
| 4242 4242 4242 4242 | Success            |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0000 0000 0069 | Expired card       |

### Test Products
Real products from FakeStore API:
1. Fjallraven Backpack - $110
2. Mens Casual T-Shirt - $22
3. Mens Cotton Jacket - $56
4. Mens Casual Shirt - $16

### Test Flow
```bash
# Test ACP endpoint
curl http://localhost:3000/.well-known/agentic-commerce.json | jq

# Test product feed
curl http://localhost:3000/api/feed/products.json | jq '.products'

# Test chat API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "add the backpack"}'
```

---

## 📚 Documentation

- **`ACP_INTEGRATION.md`** - OpenAI Agentic Commerce Protocol details
- **`STRIPE_SETUP.md`** - Stripe configuration guide
- **`USAGE_GUIDE.md`** - User instructions and commands
- **`TROUBLESHOOTING.md`** - Debug voice navigation issues
- **`PRODUCTS_API.md`** - Product data integration
- **`ENV_SETUP.md`** - Environment variables reference

---

## 🎨 Features in Detail

### Voice Recognition
- Browser-based Web Speech API
- Continuous listening mode
- Auto-restart after response
- 10-second timeout protection

### AI Conversation
- Google Gemini 2.0 Flash
- Context-aware responses
- Action marker system:
  - `[ADD_TO_CART:Product:Price]`
  - `[NAVIGATE:checkout]`
- Conversation history maintained

### Text-to-Speech
- ElevenLabs for natural voice
- Streaming audio playback
- Synchronized with UI updates
- Callback-based flow control

### Cart Management
- React Context for global state
- Real-time updates
- Quantity controls
- Total calculation with tax
- Persistent across navigation

### Checkout Flow
1. Create ACP checkout session
2. Generate Stripe PaymentIntent
3. Load Stripe Elements
4. Process payment
5. Complete order
6. Show confirmation

---

## 🚧 Known Limitations

- Voice recognition requires modern browser (Chrome/Edge recommended)
- Microphone permissions required
- Internet connection needed for API calls
- Test mode only (Stripe test keys)
- English language only
- Desktop optimized (mobile experimental)

---

## 🔮 Future Enhancements

### Short Term
- [ ] Multi-language support
- [ ] Mobile-optimized UI
- [ ] Product search and filters
- [ ] Order history
- [ ] User profiles

### Long Term
- [ ] Multi-vendor marketplace
- [ ] AR product preview
- [ ] Personalized recommendations
- [ ] Voice-based customer support
- [ ] Inventory management
- [ ] Analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

---

## 📄 License

MIT License - Free to use and modify

---

## 🙏 Acknowledgments

- **OpenAI** - Agentic Commerce Protocol
- **Google** - Gemini AI API
- **Stripe** - Payment infrastructure
- **ElevenLabs** - Text-to-speech
- **FakeStore API** - Product data
- **Clerk** - Authentication
- **Next.js Team** - Framework

---

## 📞 Support

- **Issues**: Open a GitHub issue
- **Documentation**: Check the `/docs` folder
- **Email**: support@sonorathreads.com (example)

---

## 🏆 Built for HarvardHacks

**Team**: Your Team Name
**Year**: 2025
**Category**: E-commerce Innovation

---

**Made with ❤️ and voice commands**
