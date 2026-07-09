import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workflows } from './workflows';
import { users } from './users';

export const workflowReviews = pgTable('workflow_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  workflowId: uuid('workflow_id').notNull(),
  userId: uuid('user_id').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workflowReviewsRelations = relations(workflowReviews, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowReviews.workflowId],
    references: [workflows.id],
  }),
  user: one(users, {
    fields: [workflowReviews.userId],
    references: [users.id],
  }),
}));
