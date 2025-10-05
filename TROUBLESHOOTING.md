# Troubleshooting Guide

## Voice Navigation Not Working

### Issue: "Take me to checkout" doesn't navigate

**Check These:**

1. **Open Browser Console** (F12 or Cmd+Option+I)
   - Look for logs starting with 🧭, 🛒, or 🚀
   - You should see:
     ```
     🧭 Navigation action detected: checkout
     🛒 Items in cart: X - Proceeding to checkout
     ✅ Voice finished, now navigating to checkout...
     🚀 Executing router.push('/checkout')
     ```

2. **Cart Must Have Items**
   - Add at least one item first
   - Say: "Add the hoodie to my cart"
   - Check cart icon shows a number > 0

3. **Test Phrases That Work:**
   - "Take me to checkout"
   - "I want to pay"
   - "Proceed to checkout"
   - "I'm ready to buy"
   - "Checkout please"

### Debug Steps:

**Test 1: Check AI Response**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "take me to checkout"}' | jq
```
Should return: `"navigationAction": "checkout"`

**Test 2: Check Cart State**
- Open cart sidebar
- Verify items are present
- ItemCount should be > 0

**Test 3: Manual Test**
- Add items to cart via voice
- Wait for "Added to cart" confirmation
- Open browser console (F12)
- Say: "Take me to checkout"
- Watch console logs

### Common Issues:

**1. Cart is Empty**
- Symptom: Hears "Your cart is empty"
- Fix: Add items first with "Add the [product] to cart"

**2. Navigation Marker Not Detected**
- Check AI response includes `[NAVIGATE:checkout]`
- May need to restart conversation

**3. Voice Still Speaking**
- Navigation happens AFTER voice completes
- Wait for voice to finish saying the confirmation

**4. Conversation Not Active**
- Click the black dot to start conversation first
- Dot should show "STOP" when active

### Quick Test Flow:

1. **Start conversation**: Click black dot
2. **Add item**: Say "Add the backpack to my cart"
3. **Wait**: Let AI confirm addition
4. **Navigate**: Say "Take me to checkout"
5. **Result**: Should navigate to checkout page after voice confirmation

### Still Not Working?

Check logs for these errors:
- ❌ Navigation action detected but no action taken
- ⚠️ Cart is empty! Cannot checkout
- 🔄 Conversation not active

If you see any errors, share the console output for debugging.

## Environment Variables

Make sure these are set in `.env.local`:
```bash
GEMINI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
