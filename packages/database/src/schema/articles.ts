import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';

export const articleCategories = pgTable('article_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  content: text('content').notNull(),
  categoryId: uuid('category_id'),
  authorId: uuid('author_id').notNull(),
  coverImage: text('cover_image'),
  contentType: text('content_type').default('article').notNull(),
  isPremium: boolean('is_premium').default(false).notNull(),
  priceCents: integer('price_cents').default(0).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  views: integer('views').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  readTimeMinutes: integer('read_time_minutes'),
  tags: text('tags').array().notNull().default(sql`'{}'`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const articlesRelations = relations(articles, ({ one }) => ({
  category: one(articleCategories, {
    fields: [articles.categoryId],
    references: [articleCategories.id],
  }),
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
}));
