# Environment Variables Setup

Add these to your `.env.local` file:

```bash
# Gemini API Key (for AI chat responses)
GEMINI_API_KEY=your_gemini_key_here

# ElevenLabs API Key (for voice output)
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Stripe (for payments via ACP)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Base URL (for ACP integration)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clerk (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## What You Need:
1. **Gemini API Key** - Get from https://aistudio.google.com/app/apikey
2. **ElevenLabs API Key** - Get from https://elevenlabs.io/app/settings/api-keys
3. **Stripe Keys** - Get from https://dashboard.stripe.com/test/apikeys
4. **Clerk Keys** - Already configured
