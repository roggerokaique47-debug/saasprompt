import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  source: text('source').default('landing_page'),
  converted: boolean('converted').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
