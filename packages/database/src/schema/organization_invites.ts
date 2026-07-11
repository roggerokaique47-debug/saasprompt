import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { users } from './users';

/**
 * Armazena convites pendentes para membros entrarem em uma organização.
 * Um convite é criado pelo Owner/Admin e enviado por email com o `token`.
 * Quando aceito, o invitado vira um `member` da organização.
 */
export const organizationInvites = pgTable('organization_invites', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull(),
  email: text('email').notNull(),
  role: text('role').default('viewer').notNull(), // admin | editor | viewer
  token: text('token').notNull().unique(),         // Token único enviado por email
  invitedById: uuid('invited_by_id').notNull(),
  acceptedAt: timestamp('accepted_at'),            // null = pendente
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const organizationInvitesRelations = relations(organizationInvites, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationInvites.organizationId],
    references: [organizations.id],
  }),
  invitedBy: one(users, {
    fields: [organizationInvites.invitedById],
    references: [users.id],
  }),
}));
