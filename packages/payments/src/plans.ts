/**
 * Mapeamento centralizado de Planos e Preços.
 * No ambiente real, esses IDs (ex: price_123_pro) devem vir de variáveis de ambiente (.env)
 * geradas no Dashboard do Stripe.
 */

export type PlanLevel = 'free' | 'pro' | 'enterprise' | 'lifetime';

export interface PlanConfig {
  id: string; // Stripe Price ID
  level: PlanLevel;
  tokens: number; // Quantidade de tokens creditada ao comprar
}

export const STRIPE_PLANS: Record<string, PlanConfig> = {
  // Substitua 'price_fake_pro_monthly' pelo Price ID real do Stripe depois.
  'price_fake_pro_monthly': {
    id: 'price_fake_pro_monthly',
    level: 'pro',
    tokens: 100000, // Exemplo: 100 mil tokens por mês
  },
  // Substitua 'price_fake_lifetime' pelo Price ID real do Stripe depois.
  'price_fake_lifetime': {
    id: 'price_fake_lifetime',
    level: 'lifetime',
    tokens: 9999999, // Exemplo: tokens massivos para o lifetime
  }
};

/**
 * Retorna as configurações de um plano baseado no Stripe Price ID.
 * Útil no webhook para saber quantos tokens injetar.
 */
export function getPlanByPriceId(priceId: string): PlanConfig | undefined {
  return STRIPE_PLANS[priceId];
}
