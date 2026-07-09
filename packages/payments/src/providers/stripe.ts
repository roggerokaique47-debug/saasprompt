import Stripe from 'stripe';
import { CheckoutParams, NormalizedPaymentEvent, PaymentProvider, PaymentPlan } from '../types';

export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY is missing');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'fake_key', {
      apiVersion: '2026-06-24.dahlia',
      typescript: true,
    });
  }

  private getPriceIdForPlan(plan: PaymentPlan): string {
    // Aqui assumimos assinatura mensal por padrao
    switch (plan) {
      case 'pro': return process.env.STRIPE_PRO_MONTHLY_PRICE_ID!;
      case 'team': return process.env.STRIPE_TEAM_MONTHLY_PRICE_ID!;
      case 'enterprise': return process.env.STRIPE_TEAM_YEARLY_PRICE_ID!; // Fallback
      default: throw new Error(`Plano sem preco definido no Stripe: ${plan}`);
    }
  }

  async createCheckoutSession(params: CheckoutParams): Promise<string> {
    const priceId = this.getPriceIdForPlan(params.plan);
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: params.userId,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { userId: params.userId, plan: params.plan },
    });
    return session.url!;
  }

  async createPortalSession(customerId: string, returnUrl: string): Promise<string> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session.url;
  }

  async parseWebhookEvent(body: string, signature: string, secret: string): Promise<NormalizedPaymentEvent | null> {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err) {
      throw new Error('Assinatura do Stripe Invalida');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        if (session.mode === 'subscription') {
          const userId = session.metadata?.userId;
          const plan = (session.metadata?.plan as PaymentPlan) || 'pro';
          const subId = session.subscription as string;
          
          if (!userId || !subId) return null;

          const sub = (await this.stripe.subscriptions.retrieve(subId)) as any;
          return {
            userId,
            action: 'ACTIVATE_SUBSCRIPTION',
            plan,
            subscriptionId: subId,
            status: sub.status,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            rawEvent: event,
          };
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        const userId = sub.metadata?.userId;
        if (!userId) return null;
        
        return {
          userId,
          action: 'UPDATE_SUBSCRIPTION',
          subscriptionId: sub.id,
          status: sub.status,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          rawEvent: event,
        };
      }
      
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        const userId = sub.metadata?.userId;
        if (!userId) return null;

        return {
          userId,
          action: 'CANCEL_SUBSCRIPTION',
          subscriptionId: sub.id,
          status: 'canceled',
          rawEvent: event,
        };
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subId = invoice.subscription as string;
        if (!subId) return null;
        
        const invoiceSub = (await this.stripe.subscriptions.retrieve(subId)) as any;
        const userId = invoiceSub.metadata?.userId;
        if (!userId) return null;

        return {
          userId,
          action: 'PAYMENT_FAILED',
          subscriptionId: subId,
          status: 'past_due',
          rawEvent: event,
        };
      }
    }
    
    return null; // Evento nao mapeado ou irrelevante
  }
}
