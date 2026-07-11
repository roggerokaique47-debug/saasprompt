import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { credentials } from '@prompthub/database/src/schema/credentials';
import { organizations } from '@prompthub/database/src/schema/organizations';
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

    // Get the user's default organization (the one they own)
    const orgs = await db.select().from(organizations).where(eq(organizations.ownerId, user.id)).limit(1);
    if (orgs.length === 0) {
      console.error('User has no organization context');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?error=no_organization`);
    }
    const organizationId = orgs[0].id;

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?error=oauth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?error=missing_code`);
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oauth/google/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    // Encrypt individual tokens using AES-256-GCM
    const encAccessToken = tokens.access_token ? encryptText(tokens.access_token) : null;
    const encRefreshToken = tokens.refresh_token ? encryptText(tokens.refresh_token) : null;
    
    const scopes = tokens.scope ? tokens.scope.split(' ') : [];
    
    const existing = await db
      .select()
      .from(credentials)
      .where(and(eq(credentials.organizationId, organizationId), eq(credentials.provider, 'google')))
      .limit(1);

    const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

    if (existing.length > 0) {
      const updates: any = { 
        scopes, 
        expiresAt, 
        updatedAt: new Date() 
      };
      if (encAccessToken) updates.accessToken = encAccessToken;
      if (encRefreshToken) updates.refreshToken = encRefreshToken;

      await db.update(credentials)
        .set(updates)
        .where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({
        id: uuidv4(),
        organizationId,
        provider: 'google',
        name: 'Google (Gmail, Sheets, Drive)',
        accessToken: encAccessToken,
        refreshToken: encRefreshToken,
        scopes,
        expiresAt
      });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?success=google_connected`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?error=oauth_exception`);
  }
}
