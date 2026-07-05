import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';

export const workflowCategories = pgTable('workflow_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workflows = pgTable('workflows', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  workflowJson: jsonb('workflow_json').notNull(),
  n8nVersion: text('n8n_version').default('1.0'),
  categoryId: uuid('category_id'),
  authorId: uuid('author_id').notNull(),
  isPremium: boolean('is_premium').default(false).notNull(),
  priceCents: integer('price_cents').default(0).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  downloads: integer('downloads').default(0).notNull(),
  views: integer('views').default(0).notNull(),
  ratingAvg: integer('rating_avg').default(0),
  tags: text('tags').array().notNull().default(sql`'{}'`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workflowsRelations = relations(workflows, ({ one }) => ({
  category: one(workflowCategories, {
    fields: [workflows.categoryId],
    references: [workflowCategories.id],
  }),
  author: one(users, {
    fields: [workflows.authorId],
    references: [users.id],
  }),
}));
