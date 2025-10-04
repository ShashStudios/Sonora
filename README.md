# Sonora 🎤

**Voice-First Marketplace for People with Disabilities**

Talk to Sonora, your AI shopping assistant. No clicking, no typing—just conversation.

## 🎯 Mission

Enable people with disabilities to shop and sell online using only their voice.

### Target Users
- Blind / low-vision users
- Limited mobility users
- Neurodivergent individuals
- Low literacy users

## 🏗️ Tech Stack

- **Next.js 15** + TypeScript + Tailwind
- **Gemini AI** - Conversational intelligence
- **ElevenLabs** - Voice input (STT) & output (TTS)
- **Prisma + SQLite** - Database

## 🎤 Meet Sonora

**Sonora is an AI agent** users talk to for everything:
- Search products: "Find me headphones under $100"
- Add to cart: "Add this to my cart"
- Checkout: "Buy now"
- Sell products: "I want to create a store"

**Completely hands-free. No screen needed.**

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Add API keys to `.env`:**
```env
DATABASE_URL="file:./dev.db"
ELEVENLABS_API_KEY=your_key
GEMINI_API_KEY=your_key
```

3. **Setup database:**
```bash
npm run db:push
npm run db:seed
```

4. **Run app:**
```bash
npm run dev
```

5. **Test Sonora:**
- Go to http://localhost:3000
- Click **"Talk to Sonora"**
- Hold button and say: "Show me the marketplace"

## 🎬 What Users Can Say

- **"Show me the marketplace"** - Navigate automatically
- **"Find headphones under $100"** - Search products
- **"Tell me about this"** - Product details
- **"Add to cart"** - Add product
- **"Checkout"** - Complete purchase
- **"I want to sell"** - Start seller onboarding

## 🏆 Why Sonora Wins

1. **Voice-FIRST** - Not an accessibility add-on, it's the core interface
2. **Two-sided marketplace** - Both buyers AND sellers use voice
3. **Real problem** - 11M+ blind Americans can't easily shop/sell online
4. **Conversational AI** - Natural language, not robotic commands
5. **ElevenLabs powered** - Real STT/TTS for true accessibility

## 📚 Documentation

See `SONORA_AGENT_GUIDE.md` for complete documentation.

---

Built by [@ShashPanigrahi](https://x.com/ShashPanigrahi) & [@EliotShytaj](https://x.com/EliotShytaj)
