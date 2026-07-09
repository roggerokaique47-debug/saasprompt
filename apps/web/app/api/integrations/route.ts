import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { integrations } from '@prompthub/database/src/schema/integrations';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userIntegrations = await db.select().from(integrations).where(eq(integrations.userId, user.id));
    
    return NextResponse.json(userIntegrations);
  } catch (error) {
    console.error('Fetch Integrations Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { provider, accessToken, config } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    // Upsert logic based on provider
    const existing = await db
      .select()
      .from(integrations)
      .where(and(eq(integrations.userId, user.id), eq(integrations.provider, provider)))
      .limit(1);

    if (existing.length > 0) {
      await db.update(integrations)
        .set({ accessToken, config, updatedAt: new Date() })
        .where(eq(integrations.id, existing[0].id));
    } else {
      await db.insert(integrations).values({
        id: uuidv4(),
        userId: user.id,
        provider,
        accessToken,
        config,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save Integration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
