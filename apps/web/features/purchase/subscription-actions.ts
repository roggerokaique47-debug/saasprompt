'use server';

import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { subscriptions } from '@prompthub/database/src/schema/subscriptions';
import { eq } from 'drizzle-orm';
import { PaymentFactory, PaymentPlan } from '@prompthub/payments';

export async function createSubscriptionCheckout(plan: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Usuário não autenticado' };

  const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const provider = PaymentFactory.getProvider();

  // O botão de checkout originalmente passava priceId, vamos normalizar para passar o 'plan'
  // Mas como a interface CheckoutButton espera passar o plano agora, nós mapeamos.
  const validPlan: PaymentPlan = (plan === 'pro' || plan === 'team' || plan === 'enterprise') ? plan : 'pro';

  try {
    const url = await provider.createCheckoutSession({
      userId: user.id,
      plan: validPlan,
      successUrl: `${origin}/dashboard?checkout=success`,
      cancelUrl: `${origin}/preco?checkout=canceled`,
    });
    return { url };
  } catch (error: any) {
    console.error('Erro ao criar checkout:', error);
    return { error: 'Falha no gateway de pagamento' };
  }
}

export async function createPortalSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Usuário não autenticado' };

  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  if (!sub?.stripeSubscriptionId) return { error: 'Nenhuma assinatura ativa' };

  const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const provider = PaymentFactory.getProvider();
  
  try {
    const url = await provider.createPortalSession(sub.stripeSubscriptionId, `${origin}/dashboard`);
    return { url };
  } catch (error) {
    return { error: 'Falha ao gerar portal do cliente' };
  }
}

export async function getUserPlan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { plan: 'free' };

  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  if (!sub || sub.status !== 'active') return { plan: 'free' };

  return { plan: sub.plan as 'free' | 'pro', subscription: sub };
}

export const PRICE_IDS = {
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
  },
} as const;
