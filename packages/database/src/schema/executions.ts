import { pgTable, uuid, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { agents } from './agents';
import { workflows } from './workflows';
import { users } from './users';
import { organizations } from './organizations';

export const executions = pgTable('executions', {
  id: uuid('id').defaultRandom().primaryKey(),
  workflowId: uuid('workflow_id').notNull(),
  agentId: uuid('agent_id'), // <- NEW (Execução pode pertencer a um funcionário de IA)
  userId: uuid('user_id').notNull(),
  organizationId: uuid('organization_id').notNull(),
  status: text('status').notNull().default('pending'), // pending | running | completed | failed | cancelled
  trigger: text('trigger').notNull().default('manual'), // manual | webhook | schedule | api
  triggeredBy: text('triggered_by'), // userId, webhook id, cron, etc.
  results: jsonb('results'), // Resultado agregado final de todos os nós
  error: text('error'), // Erro principal da execução (se falhou)
  durationMs: integer('duration_ms'),
  totalSteps: integer('total_steps').default(0), // Total de nós no workflow
  completedSteps: integer('completed_steps').default(0), // Nós já processados
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  creditsSpent: integer('credits_spent').default(0),
});

export const executionsRelations = relations(executions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [executions.workflowId],
    references: [workflows.id],
  }),
  agent: one(agents, {
    fields: [executions.agentId],
    references: [agents.id],
  }),
  user: one(users, {
    fields: [executions.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [executions.organizationId],
    references: [organizations.id],
  }),
}));
