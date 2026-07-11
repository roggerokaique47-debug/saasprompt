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

    const { organizationId, action, plan, subscriptionId, status, currentPeriodStart, currentPeriodEnd } = normalizedEvent;

    switch (action) {
      case 'ACTIVATE_SUBSCRIPTION': {
        if (organizationId && subscriptionId && plan) {
          await db.insert(subscriptions).values({
            organizationId,
            plan: plan,
            stripeSubscriptionId: subscriptionId, // Opcional: futuramente renomear no db para gatewaySubscriptionId
            status: status,
            currentPeriodStart: currentPeriodStart!,
            currentPeriodEnd: currentPeriodEnd!,
          }).onConflictDoNothing({ target: subscriptions.organizationId });

          // Escudo SaaS: Sincronizar o plano na tabela organizations
          const { organizations } = await import('@prompthub/database/src/schema/organizations');
          await db.update(organizations)
            .set({ plan: plan })
            .where(eq(organizations.id, organizationId));
        }
        break;
      }
      case 'UPDATE_SUBSCRIPTION': {
        if (organizationId) {
          await db.update(subscriptions)
            .set({
              status: status,
              currentPeriodStart: currentPeriodStart!,
              currentPeriodEnd: currentPeriodEnd!,
            })
            .where(eq(subscriptions.organizationId, organizationId));
        }
        break;
      }
      case 'CANCEL_SUBSCRIPTION': {
        if (organizationId) {
          await db.update(subscriptions)
            .set({ status: 'canceled', plan: 'free' })
            .where(eq(subscriptions.organizationId, organizationId));
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
        // As compras ainda precisam registrar quem fez, mas o crédito vai pra organização
        // Como o webhook event NormalizedPaymentEvent atualmente tem apenas organizationId,
        // vamos registrar o userId como um fallback se tivermos (atualmente não temos fácil sem quebrar a assinatura).
        // Vamos apenas usar organizationId.
        if (organizationId && contentType && contentId && priceCents) {
          await db.insert(purchases).values({
            userId: organizationId, // fallback temporario se o DB exigir (vamos alterar compras depois se preciso)
            organizationId,
            contentType,
            contentId,
            amountCents: priceCents,
            platformFeeCents: Math.round(priceCents * 0.3),
            creatorEarningsCents: Math.round(priceCents * 0.7),
            stripePaymentIntentId: paymentIntentId || '',
            status: 'completed',
          }).onConflictDoNothing();

          // Escudo SaaS: Creditar tokens avulsos (ex: Lifetime Deal ou Pacote de IA)
          // Na fase 5 adotamos o plano "lifetime" como compra avulsa também
          const { organizations } = await import('@prompthub/database/src/schema/organizations');
          const { sql } = await import('drizzle-orm');
          
          if (contentId === 'lifetime') {
            await db.update(organizations)
              .set({ plan: 'lifetime', credits: sql`${organizations.credits} + 1000` })
              .where(eq(organizations.id, organizationId));
          } else if (contentType === 'tokens') {
            await db.update(organizations)
              .set({ credits: sql`${organizations.credits} + 500` })
              .where(eq(organizations.id, organizationId));
          }
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
