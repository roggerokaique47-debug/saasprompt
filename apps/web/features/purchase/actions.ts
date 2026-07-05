'use server';

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { purchases } from '@prompthub/database/src/schema/purchases';
import { eq, and } from 'drizzle-orm';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-06-24.dahlia',
    typescript: true,
  });
}

export async function createContentCheckoutSession(
  contentType: 'prompt' | 'article' | 'workflow',
  contentId: string,
  priceCents: number,
  title: string,
) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { error: 'Configuração de autenticação ausente' };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Usuário não autenticado' };

  const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: title,
            metadata: { contentType, contentId },
          },
          unit_amount: priceCents,
        },
        quantity: 1,
      },
    ],
    client_reference_id: user.id,
    success_url: `${origin}/${contentType}/${contentId}?purchased=true`,
    cancel_url: `${origin}/${contentType}/${contentId}`,
    metadata: {
      userId: user.id,
      contentType,
      contentId,
      priceCents: String(priceCents),
    },
  });

  return { url: session.url };
}

export async function checkPurchase(contentType: string, contentId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return false;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const [purchase] = await db
    .select({ id: purchases.id })
    .from(purchases)
    .where(
      and(
        eq(purchases.userId, user.id),
        eq(purchases.contentType, contentType),
        eq(purchases.contentId, contentId),
        eq(purchases.status, 'completed'),
      ),
    )
    .limit(1);

  return !!purchase;
}
