# Stripe Setup Instructions

## Quick Setup (5 minutes)

### 1. Create Stripe Account
Go to: https://dashboard.stripe.com/register

### 2. Get Your API Keys
1. Visit: https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Click "Reveal test key token" and copy your **Secret key** (starts with `sk_test_`)

### 3. Add Keys to .env.local

Open `/Users/shashwat/Desktop/HarvardHacks/.env.local` and add:

```bash
# Stripe API Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

### 4. Restart Your Dev Server

```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9

# Start fresh
npm run dev
```

## Test Cards

Once configured, use these test cards in checkout:

| Card Number         | Scenario              |
|--------------------|-----------------------|
| 4242 4242 4242 4242 | Success               |
| 4000 0000 0000 9995 | Insufficient funds    |
| 4000 0000 0000 0069 | Expired card          |

- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

## Verify Setup

Test the checkout flow:

1. Add items to cart via voice: "Add the backpack"
2. Say: "Take me to checkout"
3. Payment form should load
4. Enter test card: `4242 4242 4242 4242`
5. Complete payment

## Current Status

❌ **Stripe keys are NOT currently set**

Your `.env.local` needs:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Troubleshooting

### Error: "Stripe Not Configured"
- Keys are missing from `.env.local`
- Make sure to restart server after adding keys

### Error: "Cannot read properties of undefined (reading 'match')"
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is missing or invalid
- Must start with `pk_test_` for test mode

### 500 Error on Checkout
- `STRIPE_SECRET_KEY` is missing or invalid
- Must start with `sk_test_` for test mode
- Check server logs for details

## Production Setup

When ready for production:

1. Get **live keys** from https://dashboard.stripe.com/apikeys
2. Update `.env.production` or your hosting platform
3. Keys will start with `pk_live_` and `sk_live_`
4. Test thoroughly before going live!

## More Info

- Stripe Docs: https://stripe.com/docs
- ACP + Stripe: https://docs.stripe.com/agentic-commerce
- Test Cards: https://stripe.com/docs/testing
