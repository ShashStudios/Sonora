/**
 * Stripe Integration
 * Handles payments, payouts, and Stripe Connect for sellers
 */

import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

/**
 * Create a Stripe Connect account for a seller
 */
export async function createConnectAccount(params: {
  email: string;
  country?: string;
}) {
  const account = await stripe.accounts.create({
    type: 'express',
    email: params.email,
    country: params.country || 'US',
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  return account;
}

/**
 * Create an account link for onboarding
 */
export async function createAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });

  return accountLink;
}

/**
 * Create a payment intent for checkout
 */
export async function createPaymentIntent(params: {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  connectedAccountId?: string;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(params.amount * 100), // Convert to cents
    currency: params.currency || 'usd',
    metadata: params.metadata,
    automatic_payment_methods: {
      enabled: true,
    },
    ...(params.connectedAccountId && {
      transfer_data: {
        destination: params.connectedAccountId,
      },
    }),
  });

  return paymentIntent;
}

/**
 * Retrieve payment intent status
 */
export async function getPaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Create a payout to a connected account
 */
export async function createPayout(
  accountId: string,
  amount: number,
  currency = 'usd'
) {
  const payout = await stripe.payouts.create(
    {
      amount: Math.round(amount * 100),
      currency,
    },
    {
      stripeAccount: accountId,
    }
  );

  return payout;
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err}`);
  }
}

/**
 * Get account balance
 */
export async function getAccountBalance(accountId?: string) {
  if (accountId) {
    return stripe.balance.retrieve({
      stripeAccount: accountId,
    });
  }
  return stripe.balance.retrieve();
}

/**
 * List recent transactions
 */
export async function listTransactions(accountId?: string, limit = 10) {
  return stripe.balanceTransactions.list(
    { limit },
    accountId ? { stripeAccount: accountId } : undefined
  );
}
