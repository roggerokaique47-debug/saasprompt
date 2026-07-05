import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { prompts } from './prompts';

export const downloadHistory = pgTable('download_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  promptId: uuid('prompt_id').notNull(),
  format: text('format').notNull(),
  downloadedAt: timestamp('downloaded_at').defaultNow().notNull(),
});

export const downloadsRelations = relations(downloadHistory, ({ one }) => ({
  user: one(users, {
    fields: [downloadHistory.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [downloadHistory.promptId],
    references: [prompts.id],
  }),
}));
