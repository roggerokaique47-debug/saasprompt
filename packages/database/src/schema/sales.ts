import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { prompts } from './prompts';
import { users } from './users';
import { creators } from './creators';

export const sales = pgTable('sales', {
  id: uuid('id').defaultRandom().primaryKey(),
  promptId: uuid('prompt_id').notNull(),
  buyerId: uuid('buyer_id').notNull(),
  creatorId: uuid('creator_id').notNull(),
  amountCents: integer('amount_cents').notNull(),
  platformFeeCents: integer('platform_fee_cents').notNull(),
  creatorEarningsCents: integer('creator_earnings_cents').notNull(),
  stripePaymentIntent: text('stripe_payment_intent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const salesRelations = relations(sales, ({ one }) => ({
  prompt: one(prompts, {
    fields: [sales.promptId],
    references: [prompts.id],
  }),
  buyer: one(users, {
    fields: [sales.buyerId],
    references: [users.id],
  }),
  creator: one(creators, {
    fields: [sales.creatorId],
    references: [creators.id],
  }),
}));
