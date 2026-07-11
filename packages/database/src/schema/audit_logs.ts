import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { users } from './users';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(), // 'INSERT', 'UPDATE', 'DELETE'
  tableName: text('table_name').notNull(),
  oldData: jsonb('old_data'),
  newData: jsonb('new_data'),
  ip: text('ip'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
