import { pgTable, uuid, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workflows } from './workflows';
import { users } from './users';

/**
 * workflow_versions — Histórico imutável de versões
 * Toda vez que um workflow é salvo, uma nova versão é criada.
 * A versão ativa fica em workflows.workflowJson.
 */
export const workflowVersions = pgTable('workflow_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  workflowId: uuid('workflow_id').notNull(),
  version: integer('version').notNull().default(1),
  workflowJson: jsonb('workflow_json').notNull(),
  changeNote: text('change_note'), // Descrição opcional da alteração
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workflowVersionsRelations = relations(workflowVersions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowVersions.workflowId],
    references: [workflows.id],
  }),
  creator: one(users, {
    fields: [workflowVersions.createdBy],
    references: [users.id],
  }),
}));
