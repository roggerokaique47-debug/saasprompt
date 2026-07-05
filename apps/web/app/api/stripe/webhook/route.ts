import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { purchases } from '@prompthub/database/src/schema/purchases';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-06-24.dahlia',
    typescript: true,
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const contentType = session.metadata?.contentType;
    const contentId = session.metadata?.contentId;
    const priceCents = Number(session.metadata?.priceCents ?? 0);
    const platformFeeCents = Math.round(priceCents * 0.3);
    const creatorEarningsCents = priceCents - platformFeeCents;

    if (userId && contentType && contentId) {
      await db.insert(purchases).values({
        userId,
        contentType,
        contentId,
        amountCents: priceCents,
        platformFeeCents,
        creatorEarningsCents,
        stripePaymentIntentId: session.payment_intent as string,
        status: 'completed',
      }).onConflictDoNothing();
    }
  }

  return NextResponse.json({ received: true });
}
