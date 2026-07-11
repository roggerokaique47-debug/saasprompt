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
      console.error('OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?error=oauth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?error=missing_code`);
    }

    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oauth/slack/callback`;

    if (!clientId || !clientSecret) {
      throw new Error('Missing Slack credentials in environment');
    }

    // Obter organizationId do usuário
    const organizationId = await getUserPrimaryOrgId(user.id);
    if (!organizationId) {
      throw new Error('User has no primary organization');
    }

    // Trocar o código pelo access token
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri
      }).toString()
    });

    const data = await tokenResponse.json();

    if (!data.ok) {
      throw new Error(`Slack API Error: ${data.error}`);
    }
    
    // Extrair token do Bot ou do Authed User
    const rawAccessToken = data.access_token || data.authed_user?.access_token;
    if (!rawAccessToken) {
        throw new Error('No access token returned from Slack');
    }
    const encryptedAccessToken = encryptText(rawAccessToken);
    const scopes = data.scope ? data.scope.split(',') : [];
    
    const existing = await db
      .select()
      .from(credentials)
      .where(and(eq(credentials.organizationId, organizationId), eq(credentials.provider, 'slack')))
      .limit(1);

    if (existing.length > 0) {
      await db.update(credentials)
        .set({ 
          accessToken: encryptedAccessToken, 
          scopes,
          updatedAt: new Date() 
        })
        .where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({
        id: uuidv4(),
        organizationId: organizationId,
        provider: 'slack',
        name: 'Slack',
        accessToken: encryptedAccessToken,
        scopes,
      });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?success=slack_connected`);
  } catch (error) {
    console.error('Slack OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?error=oauth_exception`);
  }
}

