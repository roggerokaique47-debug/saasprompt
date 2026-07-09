import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const usageLogs = pgTable('usage_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  action: text('action').notNull(), // Ex: 'ai_copilot', 'ai_generate', 'waha_send'
  tokensSpent: integer('tokens_spent').default(0).notNull(), // 0 se foi usado BYOK
  keyType: text('key_type').default('system').notNull(), // 'system' ou 'byok'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
