import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { workflows } from './workflows';

/**
 * webhooks — Endpoints inbound configurados pela organização
 * Cada webhook gera uma URL única: /api/webhooks/[id]
 * Ao receber um POST, dispara o workflow associado com o payload como contexto.
 */
export const webhooks = pgTable('webhooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull(),
  workflowId: uuid('workflow_id').notNull(),
  name: text('name').notNull(),
  secret: text('secret').notNull(), // HMAC secret para validar assinatura
  isActive: boolean('is_active').default(true).notNull(),
  description: text('description'),
  lastUsedAt: timestamp('last_used_at'),
  totalHits: text('total_hits').default('0'), // Contador de chamadas recebidas
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const webhooksRelations = relations(webhooks, ({ one }) => ({
  organization: one(organizations, {
    fields: [webhooks.organizationId],
    references: [organizations.id],
  }),
  workflow: one(workflows, {
    fields: [webhooks.workflowId],
    references: [workflows.id],
  }),
}));
