# Voice Shopping Guide

## 🎯 Simple & Intuitive Flow

### **Step 1: Start Shopping**
1. Go to http://localhost:3000/shop
2. Click the **black dot** in center
3. Status shows: **"🎙️ I'm listening! Try: 'Add the backpack'"**

### **Step 2: Add Items**
Say any of these:
- **"Add the backpack"**
- **"I want the jacket"**
- **"Add the premium t-shirt"**
- **"Give me the casual shirt"**

AI responds: *"Perfect! Adding [item] to your cart!"*
→ Item appears in cart instantly (see cart icon with badge)

### **Step 3: Go to Checkout**
When ready to buy, say:
- **"Checkout"**
- **"Take me to checkout"**
- **"I'm ready to pay"**
- **"Complete my purchase"**

AI responds: *"Taking you to checkout!"*
→ Navigates to Stripe payment page

### **Step 4: Complete Payment**
- Enter test card: `4242 4242 4242 4242`
- Any future expiry, any CVC
- Click "Pay Now"
- See order confirmation!

## 🛍️ Available Products

From FakeStore API (real data):
1. **Fjallraven Backpack** - $110
2. **Mens Casual Premium T-Shirt** - $22
3. **Mens Cotton Jacket** - $56
4. **Mens Casual Shirt** - $16

## 🎙️ Voice Commands

### Adding Items
- "Add [product]"
- "I want [product]"
- "Get me [product]"
- "Put [product] in my cart"

### Checking Out
- "Checkout"
- "Take me to checkout"
- "I'm ready to pay"
- "Complete purchase"
- "Proceed to payment"

### Stopping
- Click the black dot again to stop conversation

## 💡 Tips

**Natural Conversation:**
- Speak clearly and naturally
- Wait for AI response before next command
- Cart updates appear immediately
- No need to say "please" or be formal

**Cart Management:**
- Click cart icon (top-right) to view/edit items
- Adjust quantities with +/- buttons
- Remove items with trash icon
- See real-time total

**Checkout:**
- Must have items in cart
- Requires Stripe keys in `.env.local`
- Payment is instant
- Get order confirmation with ID

## 🚀 Quick Demo Script

```
You: [Click black dot]
AI: "🎙️ I'm listening!"

You: "Add the backpack"
AI: "Perfect! Adding the Backpack to your cart!"

You: "Add the cotton jacket"
AI: "Great pick! Adding the Cotton Jacket!"

You: "Checkout"
AI: "Taking you to checkout now!"

→ Payment page loads
→ Enter: 4242 4242 4242 4242
→ Click "Pay Now"
→ Order complete! 🎉
```

## 🔧 Troubleshooting

**"I'm listening but nothing happens"**
- Check browser console (F12)
- Allow microphone permissions
- Speak clearly and wait

**"Stripe Not Configured"**
- Add keys to `.env.local`
- See `STRIPE_SETUP.md`
- Restart server

**"Can't hear AI response"**
- Check volume/unmute
- Verify ELEVENLABS_API_KEY set
- Look for text response in UI

**"Items not adding to cart"**
- Check console for logs
- Verify AI includes [ADD_TO_CART:...] marker
- Make sure product name is recognized

## ✨ Features

✅ Real products with images from API
✅ Voice-native shopping experience
✅ Real-time cart updates
✅ Smooth checkout flow
✅ Stripe payment integration
✅ OpenAI ACP compliant
✅ No page reloads needed
✅ Conversational AI responses

Enjoy shopping with Sonora! 🛍️
