import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { items, ivaCharge, shipmentCharge } = await request.json();

    const params = {
      payment_method_types: ['card'],
      line_items: [
        ...items.map((item) => ({
          price_data: {
            currency: 'mxn',
            product_data: {
              name: item.name,
            },
            unit_amount: item.amount,
          },
          quantity: item.quantity,
        })),

        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: 'IVA',
            },
            unit_amount: Math.round(ivaCharge),
          },
          quantity: 1,
        },

        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: 'Envío',
            },
            unit_amount: shipmentCharge,
          },
          quantity: 1,
        },
      ],

      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
