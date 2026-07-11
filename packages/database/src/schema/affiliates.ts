import { pgTable, uuid, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const affiliates = pgTable('affiliates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(), // O usuário que é afiliado
  referralCode: text('referral_code').notNull().unique(), // Código único para link
  paypalEmail: text('paypal_email'), // Para pagamento das comissões
  isActive: boolean('is_active').default(true).notNull(),
  totalEarningsCents: integer('total_earnings_cents').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const affiliateReferrals = pgTable('affiliate_referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  affiliateId: uuid('affiliate_id').notNull(),
  referredUserId: uuid('referred_user_id').notNull(), // O novo usuário que se cadastrou
  status: text('status').default('pending').notNull(), // pending, converted (pagou)
  commissionCents: integer('commission_cents').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const affiliatesRelations = relations(affiliates, ({ one, many }) => ({
  user: one(users, {
    fields: [affiliates.userId],
    references: [users.id],
  }),
  referrals: many(affiliateReferrals),
}));

export const affiliateReferralsRelations = relations(affiliateReferrals, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [affiliateReferrals.affiliateId],
    references: [affiliates.id],
  }),
  referredUser: one(users, {
    fields: [affiliateReferrals.referredUserId],
    references: [users.id],
  }),
}));
