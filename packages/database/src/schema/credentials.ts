import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';

/**
 * credentials — Tokens OAuth e API Keys criptografados por organização
 * Cada integração (Gmail, HubSpot, Slack, etc.) salva suas credenciais aqui.
 * accessToken e refreshToken devem ser criptografados no servidor antes de salvar (AES-256-GCM).
 */
export const credentials = pgTable('credentials', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull(),
  provider: text('provider').notNull(), // gmail | hubspot | slack | openai | custom...
  name: text('name').notNull(), // Nome amigável dado pelo usuário
  accessToken: text('access_token'), // Token de acesso criptografado
  refreshToken: text('refresh_token'), // Refresh token criptografado
  scopes: text('scopes').array(), // Permissões autorizadas (OAuth)
  isActive: boolean('is_active').default(true).notNull(),
  expiresAt: timestamp('expires_at'), // Para tokens com validade (OAuth)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const credentialsRelations = relations(credentials, ({ one }) => ({
  organization: one(organizations, {
    fields: [credentials.organizationId],
    references: [organizations.id],
  }),
}));
