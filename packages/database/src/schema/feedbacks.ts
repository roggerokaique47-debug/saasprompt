import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const feedbacks = pgTable('feedbacks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(), // bug, feature_request, general
  message: text('message').notNull(),
  status: text('status').default('open'), // open, reviewed, resolved
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
