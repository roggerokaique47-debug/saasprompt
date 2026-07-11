import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { agents } from './agents';
import { workflows } from './workflows';

export const agentWorkflows = pgTable('agent_workflows', {
  agentId: uuid('agent_id').notNull(),
  workflowId: uuid('workflow_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.agentId, t.workflowId] }),
}));

export const agentWorkflowsRelations = relations(agentWorkflows, ({ one }) => ({
  agent: one(agents, {
    fields: [agentWorkflows.agentId],
    references: [agents.id],
  }),
  workflow: one(workflows, {
    fields: [agentWorkflows.workflowId],
    references: [workflows.id],
  }),
}));
