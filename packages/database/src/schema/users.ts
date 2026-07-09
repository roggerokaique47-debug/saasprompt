import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  locale: text('locale').default('pt-BR').notNull(),
  plan: text('plan').default('free').notNull(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  credits: integer('credits').default(100).notNull(), // Escudo SaaS: Saldo de tokens do usuário
  customAiKey: text('custom_ai_key'), // Chave BYOK para clientes Enterprise (não consome tokens da plataforma)
  points: integer('points').default(0).notNull(), // Fase 4: Gamificação (Conquistas)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
