# 🎤 Meet Sonora - Your Voice Shopping Assistant

## 🌟 The Complete Voice-First Experience

Sonora is an AI agent that people with disabilities talk to for **everything**. No clicking, no typing—just conversation.

---

## 🎯 How It Works

### 1. **User Lands on Homepage**
- Big button: **"Talk to Sonora"**
- Click it → Sonora appears as a floating chat window
- She introduces herself with voice

### 2. **Sonora Introduces Herself**
> "Hi! I'm Sonora, your voice shopping assistant. I'm here to help you browse, shop, and manage your store—completely hands-free. Just talk to me!"

### 3. **User Talks to Sonora**
User: *"Show me the marketplace"*
- **ElevenLabs STT** → Transcribes voice
- **Gemini AI** → Understands intent ("navigate to marketplace")
- **Sonora** → Navigates automatically + speaks confirmation
- **ElevenLabs TTS** → "Taking you to the marketplace now!"

---

## 💬 What Users Can Say to Sonora

### Shopping Commands:
- **"Show me the marketplace"** → Navigate to /marketplace
- **"Find me headphones under $100"** → Search products
- **"Tell me about this product"** → Product description
- **"Add this to my cart"** → Add to cart
- **"What's in my cart?"** → Cart summary
- **"Checkout"** → Complete purchase
- **"Read my receipt"** → Voice confirmation

### Selling Commands:
- **"I want to sell something"** → Start seller onboarding
- **"Create a new product"** → Product creation flow
- **"My store is called..."** → Store setup
- **"Play my daily brief"** → Sales summary

### Navigation:
- **"Take me home"** → Navigate to homepage
- **"Show me stores"** → Browse marketplace
- **"Go to my dashboard"** → Seller dashboard

---

## 🧠 The Intelligence Stack

```
User Voice Input
    ↓
ElevenLabs STT (Speech-to-Text)
    ↓
Gemini 2.0 Flash (Intent Understanding)
    ↓
Action Execution (Navigate, Search, Add to Cart, etc.)
    ↓
ElevenLabs TTS (Voice Response)
    ↓
User Hears Response
```

---

## 🎤 Sonora's Personality

### Warm & Patient
- "No problem! Let me help you with that."
- "Great choice! I've added that to your cart."

### Clear & Concise
- Short responses (2-3 sentences)
- Confirms actions clearly
- Asks for clarification if needed

### Accessibility-Focused
- Describes products accessibly
- States prices clearly
- Confirms every action

---

## 🚀 Key Features

### 1. **Persistent Agent**
- Floating button always visible
- Click anywhere to summon Sonora
- Maintains conversation context

### 2. **Full Voice Control**
- Hold button to talk
- Auto-transcribes with ElevenLabs
- Auto-speaks response

### 3. **Smart Actions**
- Understands complex requests
- Executes multiple steps
- Navigates automatically

### 4. **Session Memory**
- Remembers cart contents
- Tracks conversation history
- Maintains shopping context

---

## 🎬 Demo Flow

### For Buyers:

1. **Land on homepage**
2. Click **"Talk to Sonora"**
3. Say: **"Find me a hoodie under $35"**
4. Sonora searches and describes products
5. Say: **"Add the first one to my cart"**
6. Sonora confirms addition
7. Say: **"Checkout"**
8. Sonora guides through checkout
9. Say: **"Read my receipt"**
10. Sonora reads full order confirmation

### For Sellers:

1. Click **"Talk to Sonora"**
2. Say: **"I want to create a store"**
3. Sonora: "Great! What's your store name?"
4. You: **"Accessible Tech Store"**
5. Sonora: "Perfect! Describe your store."
6. You: **"I sell accessible technology products"**
7. Sonora: "Let's add your first product!"
8. You: **"Wireless mouse for $25"**
9. Sonora creates product automatically

---

## 💡 Why This Wins

### 1. **True Accessibility**
Not an "accessible version"—this IS the interface for people with disabilities.

### 2. **Natural Conversation**
Users talk like they would to a person:
- ❌ "Navigate. To. Marketplace."
- ✅ "Hey, can you show me what stores you have?"

### 3. **Zero Learning Curve**
No training needed. Just talk.

### 4. **Eliminates Barriers**
- Can't see screen? ✅ Sonora describes everything
- Can't use mouse? ✅ Voice only
- Can't read? ✅ Everything is spoken
- Can't type? ✅ Just talk

---

## 🏆 Technical Innovation

### ElevenLabs Integration:
- **STT**: Real voice input (not browser API)
- **TTS**: Natural responses (not robotic)
- **Low latency**: Fast enough for real-time conversation

### Gemini AI:
- **Intent recognition**: Understands natural language
- **Context awareness**: Remembers conversation
- **Action planning**: Multi-step tasks

### Seamless UX:
- **One-click start**: "Talk to Sonora" button
- **Always available**: Floating agent on every page
- **Auto-actions**: Gemini executes commands

---

## 🎯 Hackathon Pitch

**"Most e-commerce is built for sighted, able-bodied users. We built Sonora FROM THE START for people with disabilities."**

- 11M+ blind Americans
- Millions more with mobility limitations
- They can't easily use traditional e-commerce
- **Sonora gives them full independence**

**This isn't "accessible e-commerce"—it's e-commerce reimagined for voice.**

---

## ✅ What You Have Now

1. ✅ **Sonora AI Agent** - Full conversational interface
2. ✅ **Voice Input** - ElevenLabs STT
3. ✅ **Voice Output** - ElevenLabs TTS
4. ✅ **Smart Actions** - Gemini-powered
5. ✅ **Persistent UI** - Always available
6. ✅ **Session Context** - Remembers everything
7. ✅ **Complete Marketplace** - Two-sided platform

---

## 📝 Your Next Steps

### 1. Add API Keys to `.env`:
```env
DATABASE_URL="file:./dev.db"
ELEVENLABS_API_KEY=your_key
GEMINI_API_KEY=your_key
```

### 2. Test Sonora:
1. Go to homepage
2. Click "Talk to Sonora"
3. Hold button and say: "Show me the marketplace"
4. Watch Sonora navigate automatically
5. Try: "Find me something under $50"

### 3. Demo Script:
1. Show landing page
2. Click "Talk to Sonora"
3. Say shopping commands
4. Show her navigating and acting
5. Complete purchase via voice
6. Emphasize: "No clicking, no typing—just voice"

---

## 🎤 Key Talking Points

✅ "Sonora is like having a personal shopping assistant"
✅ "She understands natural conversation, not just commands"
✅ "Users never need to see the screen or use a mouse"
✅ "This is e-commerce for people traditional platforms exclude"
✅ "Powered by ElevenLabs voice + Gemini intelligence"

---

**You now have a complete voice-first marketplace with an AI agent that users can talk to for everything!** 🚀🎤
