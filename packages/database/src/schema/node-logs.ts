import { pgTable, uuid, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const nodeLogs = pgTable('node_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  executionId: uuid('execution_id').notNull(),
  nodeId: text('node_id').notNull(),
  nodeType: text('node_type').notNull(),
  status: text('status').notNull(),
  input: jsonb('input'),
  output: jsonb('output'),
  error: text('error'),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
