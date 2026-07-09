import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { purchases } from '@prompthub/database/src/schema/purchases';
import { subscriptions } from '@prompthub/database/src/schema/subscriptions';
import { eq } from 'drizzle-orm';
import { PaymentFactory } from '@prompthub/payments';

export async function POST(req: Request) {
  const body = await req.text();
  
  // Como estamos desacoplando o Stripe, podemos ler o secret e a signature genericamente
  // (Poderia vir headers de outras plataformas, mas a principio suportamos a logica basica do stripe aqui)
  const sig = req.headers.get('stripe-signature') || req.headers.get('x-payment-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  const provider = PaymentFactory.getProvider();
  
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET || '';
    const normalizedEvent = await provider.parseWebhookEvent(body, sig, secret);

    if (!normalizedEvent) {
      // Evento ignorado pelo provider (não mapeado ou irrelevante)
      return NextResponse.json({ received: true, status: 'ignored' });
    }

    const { userId, action, plan, subscriptionId, status, currentPeriodStart, currentPeriodEnd } = normalizedEvent;

    switch (action) {
      case 'ACTIVATE_SUBSCRIPTION': {
        if (userId && subscriptionId && plan) {
          await db.insert(subscriptions).values({
            userId,
            plan: plan,
            stripeSubscriptionId: subscriptionId, // Opcional: futuramente renomear no db para gatewaySubscriptionId
            status: status,
            currentPeriodStart: currentPeriodStart!,
            currentPeriodEnd: currentPeriodEnd!,
          }).onConflictDoNothing({ target: subscriptions.userId });
        }
        break;
      }
      case 'UPDATE_SUBSCRIPTION': {
        if (userId) {
          await db.update(subscriptions)
            .set({
              status: status,
              currentPeriodStart: currentPeriodStart!,
              currentPeriodEnd: currentPeriodEnd!,
            })
            .where(eq(subscriptions.userId, userId));
        }
        break;
      }
      case 'CANCEL_SUBSCRIPTION': {
        if (userId) {
          await db.update(subscriptions)
            .set({ status: 'canceled', plan: 'free' })
            .where(eq(subscriptions.userId, userId));
        }
        break;
      }
      case 'PAYMENT_FAILED': {
        if (subscriptionId) {
          await db.update(subscriptions)
            .set({ status: 'past_due' })
            .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));
        }
        break;
      }
      case 'ONE_TIME_PURCHASE': {
        // Logica para compra unica, caso seja retornado pelo provider no futuro
        const { contentType, contentId, priceCents, paymentIntentId } = normalizedEvent;
        if (userId && contentType && contentId && priceCents) {
          await db.insert(purchases).values({
            userId,
            contentType,
            contentId,
            amountCents: priceCents,
            platformFeeCents: Math.round(priceCents * 0.3),
            creatorEarningsCents: Math.round(priceCents * 0.7),
            stripePaymentIntentId: paymentIntentId || '',
            status: 'completed',
          }).onConflictDoNothing();
        }
        break;
      }
    }

    return NextResponse.json({ received: true, action: normalizedEvent.action });
  } catch (error) {
    console.error('[PAYMENT GATEWAY WEBHOOK ERROR]:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
