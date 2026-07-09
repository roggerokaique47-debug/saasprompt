import { NextResponse } from 'next/server';
import { stripe } from '@prompthub/stripe';
import db from '@prompthub/database/src/client';
import { users } from '@prompthub/database/src/schema/users';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

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

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    // Verifica se a sessão é de compra de tokens
    if (session.metadata?.type === 'tokens') {
      const userId = session.metadata.userId;
      
      // Aqui, você pode definir quantos tokens adicionar com base no priceId,
      // ou se quiser algo simples, adicionar uma quantidade fixa por pacote:
      const tokensToAdd = 500; // Valor fixo de exemplo, ajustar conforme os preços

      const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (userResult.length > 0) {
        const dbUser = userResult[0];
        await db.update(users)
          .set({ credits: dbUser.credits + tokensToAdd })
          .where(eq(users.id, userId));
          
        console.log(`Tokens added successfully to user ${userId}`);
      }
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
}
