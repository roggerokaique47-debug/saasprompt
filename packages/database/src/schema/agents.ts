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

export const agentCategories = pgTable('agent_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const agents = pgTable('agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  content: text('content').notNull(),
  platform: text('platform').array().notNull().default(sql`'{"claude","cursor"}'`),
  categoryId: uuid('category_id'),
  authorId: uuid('author_id').notNull(),
  isPremium: boolean('is_premium').default(false).notNull(),
  priceCents: integer('price_cents').default(0).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  downloads: integer('downloads').default(0).notNull(),
  views: integer('views').default(0).notNull(),
  ratingAvg: integer('rating_avg').default(0),
  tags: text('tags').array().notNull().default(sql`'{}'`),
  source: text('source'),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const agentsRelations = relations(agents, ({ one }) => ({
  category: one(agentCategories, {
    fields: [agents.categoryId],
    references: [agentCategories.id],
  }),
  author: one(users, {
    fields: [agents.authorId],
    references: [users.id],
  }),
}));
