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
      console.error('Typeform OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?error=oauth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?error=missing_code`);
    }

    const clientId = process.env.TYPEFORM_CLIENT_ID;
    const clientSecret = process.env.TYPEFORM_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oauth/typeform/callback`;

    if (!clientId || !clientSecret) {
      throw new Error('Missing Typeform credentials in environment');
    }

    // Obter organizationId do usuário
    const organizationId = await getUserPrimaryOrgId(user.id);
    if (!organizationId) {
      throw new Error('User has no primary organization');
    }

    // Trocar o código pelo access token via Typeform OAuth
    const tokenResponse = await fetch('https://api.typeform.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Typeform API Error: ${data.error_description || data.error}`);
    }

    const rawAccessToken = data.access_token;
    if (!rawAccessToken) {
      throw new Error('No access token returned from Typeform');
    }

    const encryptedAccessToken = encryptText(rawAccessToken);
    const encryptedRefreshToken = data.refresh_token ? encryptText(data.refresh_token) : undefined;
    const expiresAt = data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000)
      : undefined;

    const existing = await db
      .select()
      .from(credentials)
      .where(and(eq(credentials.organizationId, organizationId), eq(credentials.provider, 'typeform')))
      .limit(1);

    if (existing.length > 0) {
      await db.update(credentials)
        .set({
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken,
          expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({
        id: uuidv4(),
        organizationId,
        provider: 'typeform',
        name: 'Typeform',
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresAt,
      });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?success=typeform_connected`);
  } catch (error) {
    console.error('Typeform OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?error=oauth_exception`);
  }
}
