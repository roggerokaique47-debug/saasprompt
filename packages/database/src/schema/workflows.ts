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
import { organizations } from './organizations';

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
  isActive: boolean('is_active').default(true).notNull(),
  categoryId: uuid('category_id'),
  authorId: uuid('author_id').notNull(),
  organizationId: uuid('organization_id').notNull(), // <- NEW
  originalTemplateId: uuid('original_template_id'), // Referência ao template do marketplace se for um fork
  isPremium: boolean('is_premium').default(false).notNull(),
  priceCents: integer('price_cents').default(0).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  downloads: integer('downloads').default(0).notNull(),
  views: integer('views').default(0).notNull(),
  ratingAvg: integer('rating_avg').default(0),
  tags: text('tags').array().notNull().default(sql`'{}'`),
  // ROI Metrics: quanto tempo/dinheiro essa automação poupa por execução
  estimatedTimeSavedMs: integer('estimated_time_saved_ms').default(300000).notNull(), // padrão: 5min
  estimatedCostSavedCents: integer('estimated_cost_saved_cents').default(0).notNull(),
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
  organization: one(organizations, {
    fields: [workflows.organizationId],
    references: [organizations.id],
  }),
}));
