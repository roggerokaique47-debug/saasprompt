import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createTokenCheckoutSession } from '@prompthub/stripe';
import db from '@prompthub/database/src/client';
import { organizations } from '@prompthub/database/src/schema/organizations';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar a organização ativa do usuário
    const orgs = await db.select().from(organizations).where(eq(organizations.ownerId, user.id)).limit(1);
    if (orgs.length === 0) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }
    const organizationId = orgs[0].id;

    let priceId: string | null = null;
    let isFormData = false;

    // A rota pode ser chamada via fetch (JSON) ou via HTML Form nativo
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      priceId = formData.get('priceId') as string;
      isFormData = true;
    } else {
      const body = await req.json();
      priceId = body.priceId;
    }

    if (!priceId) {
      // Fallback para o price ID default se não vier no form
      priceId = process.env.STRIPE_TOKEN_PACKAGE_PRICE_ID || 'price_12345';
    }

    // Default to localhost if origin is missing
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await createTokenCheckoutSession({
      userId: user.id,
      organizationId: organizationId,
      priceId: priceId,
      successUrl: `${origin}/dashboard/faturamento?success=true`,
      cancelUrl: `${origin}/dashboard/faturamento?canceled=true`,
    });

    if (isFormData && session.url) {
      return NextResponse.redirect(session.url, 303);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
