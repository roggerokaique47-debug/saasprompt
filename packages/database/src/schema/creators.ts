import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { sales } from './sales';
import { payouts } from './payouts';

export const creators = pgTable('creators', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  bio: text('bio'),
  stripeAccountId: text('stripe_account_id'),
  totalEarnings: integer('total_earnings').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const creatorsRelations = relations(creators, ({ one, many }) => ({
  user: one(users, {
    fields: [creators.userId],
    references: [users.id],
  }),
  sales: many(sales),
  payouts: many(payouts),
}));
