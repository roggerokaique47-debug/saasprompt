import db from '@prompthub/database/src/client';
import { credentials } from '@prompthub/database/src/schema/credentials';
import { eq } from 'drizzle-orm';
import { encryptText, decryptText } from './crypto';
import { google } from 'googleapis';

export class TokenManager {
  /**
   * Obtém um access token válido para uma credencial.
   * Se o token estiver expirado e existir um refresh token, 
   * ele faz o refresh automaticamente e atualiza o BD.
   */
  static async getValidAccessToken(credentialId: string): Promise<string | null> {
    const creds = await db
      .select()
      .from(credentials)
      .where(eq(credentials.id, credentialId))
      .limit(1);

    if (creds.length === 0) {
      throw new Error('Credential not found');
    }

    const cred = creds[0];

    // Se não tem validade (ex: chaves estáticas), ou ainda é válido (+1 min de margem)
    if (!cred.expiresAt || cred.expiresAt.getTime() > Date.now() + 60000) {
      if (!cred.accessToken) return null;
      return decryptText(cred.accessToken);
    }

    // Está expirado. Precisamos fazer o refresh.
    if (!cred.refreshToken) {
      throw new Error('Token expired and no refresh token available');
    }

    const rawRefreshToken = decryptText(cred.refreshToken);

    if (cred.provider === 'google') {
      return this.refreshGoogleToken(cred.id, rawRefreshToken);
    }

    // Futuro: Adicionar suporte a Slack, HubSpot, etc.
    throw new Error(`Refresh not implemented for provider: ${cred.provider}`);
  }

  private static async refreshGoogleToken(credentialId: string, refreshToken: string): Promise<string> {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials: newTokens } = await oauth2Client.refreshAccessToken();

    const encAccessToken = newTokens.access_token ? encryptText(newTokens.access_token) : null;
    const expiresAt = newTokens.expiry_date ? new Date(newTokens.expiry_date) : null;

    if (!encAccessToken) {
      throw new Error('Failed to refresh Google access token');
    }

    await db
      .update(credentials)
      .set({
        accessToken: encAccessToken,
        expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(credentials.id, credentialId));

    return newTokens.access_token as string;
  }
}
