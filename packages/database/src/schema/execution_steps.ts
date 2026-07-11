import { pgTable, uuid, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { executions } from './executions';
import { organizations } from './organizations';

/**
 * execution_steps — Log granular de cada nó em uma execução
 * 
 * Substitui node_logs com mais detalhes e suporte a streaming via Supabase Realtime.
 * O worker insere um step para cada nó imediatamente ao iniciar e ao terminar,
 * permitindo que o frontend escute mudanças em tempo real.
 * 
 * status flow: pending → running → success | error | skipped
 */
export const executionSteps = pgTable('execution_steps', {
  id: uuid('id').defaultRandom().primaryKey(),
  executionId: uuid('execution_id').notNull(),
  organizationId: uuid('organization_id').notNull(),
  nodeId: text('node_id').notNull(),
  nodeLabel: text('node_label').notNull().default('Node'),
  nodeType: text('node_type').notNull(),
  status: text('status').notNull().default('pending'), // pending | running | success | error | skipped
  input: jsonb('input'),
  output: jsonb('output'),
  error: text('error'),
  durationMs: integer('duration_ms'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const executionStepsRelations = relations(executionSteps, ({ one }) => ({
  execution: one(executions, {
    fields: [executionSteps.executionId],
    references: [executions.id],
  }),
  organization: one(organizations, {
    fields: [executionSteps.organizationId],
    references: [organizations.id],
  }),
}));
