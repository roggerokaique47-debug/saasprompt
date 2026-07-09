import { pgTable, uuid, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const executions = pgTable('executions', {
  id: uuid('id').defaultRandom().primaryKey(),
  workflowId: uuid('workflow_id').notNull(),
  userId: uuid('user_id').notNull(),
  status: text('status').notNull().default('pending'),
  trigger: text('trigger').notNull().default('manual'),
  results: jsonb('results'),
  error: text('error'),
  durationMs: integer('duration_ms'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
