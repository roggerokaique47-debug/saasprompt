import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { integrations } from '@prompthub/database/src/schema/integrations';
import { users } from '@prompthub/database/src/schema/users';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { encryptText, decryptText } from '@prompthub/shared';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await db.select({ organizationId: users.organizationId }).from(users).where(eq(users.id, user.id)).limit(1);
    const organizationId = userData[0]?.organizationId;

    if (!organizationId) {
      return NextResponse.json({ error: 'User does not belong to an organization' }, { status: 403 });
    }

    const userIntegrations = await db.select().from(integrations).where(eq(integrations.organizationId, organizationId));
    
    // Buscar também credenciais (Google OAuth)
    const { credentials } = await import('@prompthub/database/src/schema/credentials');
    const userCredentials = await db.select().from(credentials).where(eq(credentials.organizationId, organizationId));
    
    const sanitizedIntegrations = userIntegrations.map(integration => {
      let maskedToken = null;
      if (integration.accessToken) {
         try {
           const decrypted = decryptText(integration.accessToken);
           if (decrypted.length > 8) {
             maskedToken = `${decrypted.substring(0, 4)}...${decrypted.substring(decrypted.length - 4)}`;
           } else {
             maskedToken = '***';
           }
         } catch (e) {
           maskedToken = 'invalid_format';
         }
      }
      return {
        ...integration,
        accessToken: maskedToken // Protect the real token from the frontend
      };
    });

    const sanitizedCredentials = userCredentials.map(cred => {
      // Para o Google, Slack, e HubSpot, só precisamos sinalizar que existe
      return {
        id: cred.id,
        provider: cred.provider,
        accessToken: '***', // Mascarado por segurança
        scopes: cred.scopes,
        expiresAt: cred.expiresAt
      };
    });

    return NextResponse.json([...sanitizedIntegrations, ...sanitizedCredentials]);
  } catch (error) {
    console.error('Fetch Integrations Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { IntegrationsSchema } from '@prompthub/shared/src/validations/apiSchema';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await db.select({ organizationId: users.organizationId }).from(users).where(eq(users.id, user.id)).limit(1);
    const organizationId = userData[0]?.organizationId;

    if (!organizationId) {
      return NextResponse.json({ error: 'User does not belong to an organization' }, { status: 403 });
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parsed = IntegrationsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Provider is required', details: parsed.error.format() }, { status: 400 });
    }

    const { provider, accessToken, config } = parsed.data;

    // Upsert logic based on provider
    const existing = await db
      .select()
      .from(integrations)
      .where(and(eq(integrations.organizationId, organizationId), eq(integrations.provider, provider)))
      .limit(1);

    const encryptedToken = accessToken ? encryptText(accessToken) : null;

    if (existing.length > 0) {
      await db.update(integrations)
        .set({ accessToken: encryptedToken, config, updatedAt: new Date() })
        .where(eq(integrations.id, existing[0].id));
    } else {
      await db.insert(integrations).values({
        id: uuidv4(),
        organizationId: organizationId,
        provider,
        accessToken: encryptedToken,
        config,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save Integration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
