import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function createPaymentIntent(
  amount: number,
  currency: string = "usd"
) {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
  });
}

export async function chargePaymentMethod(
  paymentMethodId: string,
  amount: number,
  currency: string = "usd"
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method: paymentMethodId,
    confirm: true,
    automatic_payment_methods: { enabled: false },
  });
}

export { stripe };
