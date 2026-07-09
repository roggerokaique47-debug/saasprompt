import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createTokenCheckoutSession } from '@prompthub/stripe';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Default to localhost if origin is missing
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await createTokenCheckoutSession({
      userId: user.id,
      priceId: priceId,
      successUrl: `${origin}/dashboard/faturamento?success=true`,
      cancelUrl: `${origin}/dashboard/faturamento?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
