import { NextApiRequest, NextApiResponse } from 'next';
import { formatAmountForStripe } from 'util/stripe/';
import { customError, methodNotAllowed } from 'util/api/util';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});
const CURRENCY = 'eur';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res);

  const { amount, payment_intent_id }: { amount: number; payment_intent_id?: string } = req.body;
  // Validate the amount that was passed from the client.
  if (!(amount >= 5 && amount <= 5000)) return customError(res, 400, 'Invalid amount');
  if (payment_intent_id) {
    try {
      const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
      // If PaymentIntent has been created, just update the amount.
      if (current_intent) {
        const updated_intent = await stripe.paymentIntents.update(payment_intent_id, {
          amount: formatAmountForStripe(amount, CURRENCY),
        });
        res.status(200).json(updated_intent);
        return;
      }
    } catch (e) {
      if ((e as any).code !== 'resource_missing') {
        const errorMessage = e instanceof Error ? e.message : 'Internal server error';
        return customError(res, 500, errorMessage);
      }
    }
  }
  try {
    // Create PaymentIntent from body params.
    const params: Stripe.PaymentIntentCreateParams = {
      amount: formatAmountForStripe(amount, CURRENCY),
      currency: CURRENCY,
      description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? '',
      automatic_payment_methods: {
        enabled: true,
      },
    };
    const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params);

    res.status(200).json(payment_intent);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return customError(res, 500, errorMessage);
  }
}
