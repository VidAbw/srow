import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { formatAmountForStripe } from '@/lib/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, currency } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const params: Stripe.PaymentIntentCreateParams = {
      amount: formatAmountForStripe(amount, currency),
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    };

    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params);

    res.status(200).json(paymentIntent);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
} 