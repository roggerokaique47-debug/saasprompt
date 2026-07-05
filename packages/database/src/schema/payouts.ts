import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { creators } from './creators';

export const payouts = pgTable('payouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').notNull(),
  amountCents: integer('amount_cents').notNull(),
  status: text('status').default('pending').notNull(),
  stripeTransferId: text('stripe_transfer_id'),
  notes: text('notes'),
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
  processedAt: timestamp('processed_at'),
});

export const payoutsRelations = relations(payouts, ({ one }) => ({
  creator: one(creators, {
    fields: [payouts.creatorId],
    references: [creators.id],
  }),
}));
