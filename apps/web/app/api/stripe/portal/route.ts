import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { organizations } from '@prompthub/database/src/schema/organizations';
import { eq } from 'drizzle-orm';
import { createPortalSession } from '@prompthub/stripe';

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
    const organization = orgs[0];

    if (!organization.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe Customer ID found' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const returnUrl = `${origin}/dashboard/faturamento`;

    const session = await createPortalSession(organization.stripeCustomerId, returnUrl);

    // O request pode vir de um form nativo ou via fetch JSON
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      return NextResponse.redirect(session.url, 303);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Portal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
