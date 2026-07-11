import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const usageLogs = pgTable('usage_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  workflowId: uuid('workflow_id'),
  action: text('action').notNull(), // Ex: 'workflow_execution', 'ai_copilot'
  creditsSpent: integer('credits_spent').default(0).notNull(), // Quantos créditos isso custou
  keyType: text('key_type').default('system').notNull(), // 'system' ou 'byok'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
