import { NextResponse } from 'next/server';
import { stripe } from '@prompthub/stripe';
import db from '@prompthub/database/src/client';
import { organizations } from '@prompthub/database/src/schema/organizations';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { getPlanByPriceId } from '@prompthub/payments/src/plans';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed.', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // 1. Lidar com Compras Únicas (Lifetime, Créditos extras) ou Primeira Assinatura
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Recuperar organizationId e atualizar customerId
    const organizationId = session.metadata?.organizationId;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string | undefined;
    
    if (organizationId) {
      if (customerId) {
        await db.update(organizations)
          .set({ stripeCustomerId: customerId, ...(subscriptionId ? { stripeSubscriptionId: subscriptionId } : {}) })
          .where(eq(organizations.id, organizationId));
      }

      if (session.metadata?.type === 'tokens') {
        await provisionCustomTokens(organizationId, 1000);
      } else {
        const priceId = session.metadata?.priceId || session.line_items?.data[0]?.price?.id;
        if (priceId) {
          await provisionTokens(organizationId, priceId);
        }
      }
    }
  }

  // 2. Lidar com Renovações de Assinatura (Mensal, Anual)
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null };
    
    if (invoice.subscription) {
      const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
      
      let organizationId: string | undefined;
      let priceId: string | undefined;

      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        organizationId = subscription.metadata?.organizationId;
        priceId = subscription.items.data[0]?.price.id;
      } catch (err: any) {
        console.warn(`Could not retrieve subscription ${subscriptionId} from Stripe:`, err.message);
        // Fallback: Tentar pegar priceId da linha do invoice, já que a subscription falhou
        priceId = (invoice.lines?.data[0] as any)?.price?.id;
      }

      if (organizationId && priceId) {
        // Renovou? Coloca mais tokens!
        await provisionTokens(organizationId, priceId);
      } else if (priceId) {
        // Fallback buscando a org pelo subscriptionId no banco local
        const orgs = await db.select().from(organizations).where(eq(organizations.stripeSubscriptionId, subscriptionId)).limit(1);
        if (orgs.length > 0) {
          await provisionTokens(orgs[0].id, priceId);
        } else {
          console.error(`Organization not found for subscription ${subscriptionId}`);
        }
      } else {
        console.error(`Could not determine priceId or organizationId for invoice ${invoice.id}`);
      }
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
}

/**
 * Função Auxiliar para prover tokens e atualizar plano.
 */
async function provisionTokens(organizationId: string, priceId: string) {
  const planConfig = getPlanByPriceId(priceId);
  
  if (!planConfig) {
    console.warn(`Price ID nao mapeado recebido: ${priceId}`);
    return;
  }

  const orgResult = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);
  
  if (orgResult.length > 0) {
    const dbOrg = orgResult[0];
    await db.update(organizations)
      .set({ 
        credits: dbOrg.credits + planConfig.tokens,
        plan: planConfig.level 
      })
      .where(eq(organizations.id, organizationId));
      
    console.log(`Tokens added successfully to org ${organizationId}. Plan updated to ${planConfig.level}`);
  }
}

async function provisionCustomTokens(organizationId: string, amount: number) {
  const orgResult = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);
  
  if (orgResult.length > 0) {
    const dbOrg = orgResult[0];
    await db.update(organizations)
      .set({ credits: dbOrg.credits + amount })
      .where(eq(organizations.id, organizationId));
      
    console.log(`+${amount} Tokens added to org ${organizationId} via standalone purchase.`);
  }
}
