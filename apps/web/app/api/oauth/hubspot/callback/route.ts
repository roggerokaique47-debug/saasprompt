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

    const clientId = process.env.HUBSPOT_CLIENT_ID;
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oauth/hubspot/callback`;

    if (!clientId || !clientSecret) {
      throw new Error('Missing HubSpot credentials in environment');
    }

    // Obter organizationId do usuário
    const organizationId = await getUserPrimaryOrgId(user.id);
    if (!organizationId) {
      throw new Error('User has no primary organization');
    }

    // Trocar o código pelo access token
    const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri
      }).toString()
    });

    const data = await tokenResponse.json();

    if (data.status === 'error' || data.error) {
      throw new Error(`HubSpot API Error: ${data.message || data.error_description || data.error}`);
    }
    
    if (!data.access_token) {
        throw new Error('No access token returned from HubSpot');
    }
    
    const encryptedAccessToken = encryptText(data.access_token);
    const encryptedRefreshToken = data.refresh_token ? encryptText(data.refresh_token) : null;
    const expiresAt = data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null;
    
    const existing = await db
      .select()
      .from(credentials)
      .where(and(eq(credentials.organizationId, organizationId), eq(credentials.provider, 'hubspot')))
      .limit(1);

    if (existing.length > 0) {
      await db.update(credentials)
        .set({ 
          accessToken: encryptedAccessToken, 
          refreshToken: encryptedRefreshToken,
          expiresAt,
          updatedAt: new Date() 
        })
        .where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({
        id: uuidv4(),
        organizationId: organizationId,
        provider: 'hubspot',
        name: 'HubSpot',
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresAt
      });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?success=hubspot_connected`);
  } catch (error) {
    console.error('HubSpot OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/integracoes?error=oauth_exception`);
  }
}

