import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { credentials } from '@prompthub/database/src/schema/credentials';
import { getUserPrimaryOrgId } from '@prompthub/shared/src/rbac/guard';
import { eq, and } from 'drizzle-orm';
import { encryptText } from '@prompthub/shared';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`);
    }

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('Notion OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?error=oauth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?error=missing_code`);
    }

    const clientId = process.env.NOTION_CLIENT_ID;
    const clientSecret = process.env.NOTION_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oauth/notion/callback`;

    if (!clientId || !clientSecret) {
      throw new Error('Missing Notion credentials in environment');
    }

    // Obter organizationId do usuário
    const organizationId = await getUserPrimaryOrgId(user.id);
    if (!organizationId) {
      throw new Error('User has no primary organization');
    }

    // Trocar o código pelo access token usando Basic Auth (conforme documentação Notion)
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Notion API Error: ${data.error_description || data.error}`);
    }

    const rawAccessToken = data.access_token;
    if (!rawAccessToken) {
      throw new Error('No access token returned from Notion');
    }

    const encryptedAccessToken = encryptText(rawAccessToken);

    const existing = await db
      .select()
      .from(credentials)
      .where(and(eq(credentials.organizationId, organizationId), eq(credentials.provider, 'notion')))
      .limit(1);

    if (existing.length > 0) {
      await db.update(credentials)
        .set({
          accessToken: encryptedAccessToken,
          updatedAt: new Date(),
        })
        .where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({
        id: uuidv4(),
        organizationId,
        provider: 'notion',
        name: `Notion (${data.workspace_name || 'Workspace'})`,
        accessToken: encryptedAccessToken,
      });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?success=notion_connected`);
  } catch (error) {
    console.error('Notion OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?error=oauth_exception`);
  }
}
