import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  email: text('email').notNull(),
  source: text('source').default('landing_page'),
  converted: boolean('converted').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
