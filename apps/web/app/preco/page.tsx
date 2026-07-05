import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planos e Preços',
  description: 'Escolha o plano ideal para você.',
};

const plans = [
  {
    name: 'Free',
    price: 'R$ 0',
    period: '/mês',
    description: 'Para começar a explorar',
    features: [
      'Busca ilimitada de prompts',
      'Prompts gratuitos',
      'Downloads limitados (10/dia)',
      'Copy com 1 clique',
      'Anúncios',
    ],
    cta: 'Começar Grátis',
    featured: false,
  },
  {
    name: 'Pro',
    price: 'R$ 29,90',
    period: '/mês',
    description: 'Para uso profissional',
    features: [
      'Tudo do Free',
      'Biblioteca completa (grátis + premium)',
      'Downloads ilimitados',
      'Sem anúncios',
      'Coleções pessoais ilimitadas',
      'Histórico completo',
      'Suporte prioritário',
    ],
    cta: 'Assinar Pro',
    featured: true,
  },
  {
    name: 'Team',
    price: 'R$ 89',
    period: '/mês',
    description: 'Para times de até 5 pessoas',
    features: [
      'Tudo do Pro',
      'Até 5 membros',
      'Biblioteca compartilhada',
      'Prompts privados do time',
      'Analytics de uso',
      'Gestão de permissões',
      'Suporte dedicado',
    ],
    cta: 'Assinar Team',
    featured: false,
  },
];

export default function PrecoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="mb-4 text-4xl font-bold">Planos e Preços</h1>
      <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
        Escolha o plano ideal para suas necessidades. Cancele quando quiser.
      </p>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl border p-8 text-left ${
              plan.featured
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-border bg-white'
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                Mais Popular
              </span>
            )}
            <h2 className="mb-1 text-2xl font-bold">{plan.name}</h2>
            <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="mb-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-success">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full rounded-lg py-3 font-medium ${
                plan.featured
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
