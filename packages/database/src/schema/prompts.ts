import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { categories } from './categories';
import { users } from './users';
import { reviews } from './reviews';
import { downloadHistory } from './downloads';

export const prompts = pgTable('prompts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  content: text('content').notNull(),
  model: text('model').array().notNull().default(sql`'{}'`),
  categoryId: uuid('category_id'),
  authorId: uuid('author_id'),
  language: text('language').default('pt-BR').notNull(),
  priceCents: integer('price_cents').default(0).notNull(),
  downloads: integer('downloads').default(0).notNull(),
  views: integer('views').default(0).notNull(),
  ratingAvg: decimal('rating_avg', { precision: 3, scale: 2 }).default('0'),
  ratingCount: integer('rating_count').default(0),
  isPublished: boolean('is_published').default(false).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  tags: text('tags').array().notNull().default(sql`'{}'`),
  variables: jsonb('variables').default('[]'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  category: one(categories, {
    fields: [prompts.categoryId],
    references: [categories.id],
  }),
  author: one(users, {
    fields: [prompts.authorId],
    references: [users.id],
  }),
  reviews: many(reviews),
  downloads: many(downloadHistory),
}));
