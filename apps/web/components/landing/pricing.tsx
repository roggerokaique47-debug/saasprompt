import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 'R$ 0',
    period: '/mês',
    desc: 'Para começar a automatizar',
    features: [
      '2 workflows ativos',
      '100 execuções/mês',
      '5 integrações',
      'Templates básicos',
      'Comunidade',
    ],
    cta: 'Começar Grátis',
    featured: false,
  },
  {
    name: 'Pro',
    price: 'R$ 49,90',
    period: '/mês',
    desc: 'Para profissionais e equipes',
    features: [
      'Workflows ilimitados',
      '10.000 execuções/mês',
      'Todas as integrações',
      'Funcionários de IA',
      'Marketplace completo',
      'Suporte prioritário',
    ],
    cta: 'Assinar Pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    period: '',
    desc: 'Para grandes empresas',
    features: [
      'Tudo do Pro',
      'Execuções ilimitadas',
      'SLA garantido',
      'Onboarding dedicado',
      'Agentes personalizados',
      'Self-hosted disponível',
    ],
    cta: 'Falar com Vendas',
    featured: false,
  },
];

export function Pricing() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold">
            Planos e Preços
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Escolha o plano ideal para sua empresa. Cancele quando quiser.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-8 ${
                plan.featured
                  ? 'border-primary bg-white shadow-xl shadow-primary/10'
                  : 'border-border bg-white'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                  Mais Popular
                </span>
              )}
              <h2 className="mb-1 text-2xl font-bold">{plan.name}</h2>
              <p className="mb-4 text-sm text-muted-foreground">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.featured ? '/cadastro' : '/cadastro'}
                className={`flex w-full items-center justify-center rounded-lg py-3 text-sm font-medium transition ${
                  plan.featured
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'border border-border hover:bg-muted'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
