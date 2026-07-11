import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { organizations } from './organizations';

export const feedbacks = pgTable('feedbacks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  type: text('type').notNull(), // bug, feature_request, general
  message: text('message').notNull(),
  status: text('status').default('open'), // open, reviewed, resolved
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
