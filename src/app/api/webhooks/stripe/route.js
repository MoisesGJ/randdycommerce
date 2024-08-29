import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import SendEmail from '@/app/_lib/resend/send-email';
import Template from '@/app/_lib/resend/templates/shop-html';
import { updateOrderStatus } from '@/app/_lib/mongo/adapter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const user = await updateOrderStatus(session.id, 'paid');

      if (user) {
        await SendEmail(
          [user.email],
          '¡Gracias por tu compra!',
          Template(user.id)
        );
      }

      break;

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
