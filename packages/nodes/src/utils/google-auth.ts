import { google, Auth } from 'googleapis';
import db from '@prompthub/database/src/client';
import { credentials } from '@prompthub/database/src/schema/credentials';
import { eq, and } from 'drizzle-orm';
import { decryptText, encryptText } from '@prompthub/shared';

export async function getGoogleAuthClient(organizationId: string): Promise<Auth.OAuth2Client> {
  const existing = await db
    .select()
    .from(credentials)
    .where(and(eq(credentials.organizationId, organizationId), eq(credentials.provider, 'google')))
    .limit(1);

  if (existing.length === 0) {
    throw new Error('Google integration not found or disconnected for this organization');
  }

  const { accessToken: encAccess, refreshToken: encRefresh, expiresAt } = existing[0];
  
  const tokens: any = {};
  if (encAccess) tokens.access_token = decryptText(encAccess);
  if (encRefresh) tokens.refresh_token = decryptText(encRefresh);
  if (expiresAt) tokens.expiry_date = expiresAt.getTime();

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oauth/google/callback`
  );

  oauth2Client.setCredentials(tokens);

  // Renovação automática
  oauth2Client.on('tokens', async (newTokens) => {
    try {
      const updates: any = { updatedAt: new Date() };
      
      if (newTokens.access_token) {
        updates.accessToken = encryptText(newTokens.access_token);
      }
      if (newTokens.refresh_token) {
        updates.refreshToken = encryptText(newTokens.refresh_token);
      }
      if (newTokens.expiry_date) {
        updates.expiresAt = new Date(newTokens.expiry_date);
      }
      
      await db.update(credentials)
        .set(updates)
        .where(eq(credentials.id, existing[0].id));
    } catch (e) {
      console.error('Failed to update refreshed tokens in DB', e);
    }
  });

  return oauth2Client;
}
