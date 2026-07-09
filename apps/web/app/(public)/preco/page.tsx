import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckoutButton } from '@/components/checkout-button';

export const metadata: Metadata = {
  title: 'Planos e Preços - NovaFlow AI',
  description: 'Escolha o plano ideal para automatizar seu negócio com IA.',
};

const plans = [
  {
    name: 'Free',
    price: 'R$ 0',
    period: '/mês',
    description: 'Para começar a explorar automações',
    features: [
      'Até 100 execuções/mês',
      '5 workflows ativos',
      '10 integrações básicas',
      'Templates da comunidade',
      '1 Funcionário de IA',
      'Suporte por email',
    ],
    cta: 'Começar Grátis',
    featured: false,
  },
  {
    name: 'Pro',
    price: 'R$ 97',
    period: '/mês',
    description: 'Para profissionais e pequenas empresas',
    features: [
      'Execuções ilimitadas',
      'Workflows ilimitados',
      'Todas as 80+ integrações',
      'Templates premium inclusos',
      'IA que cria workflows',
      'Funcionários de IA ilimitados',
      'Analytics avançado',
      'Suporte prioritário',
      'Sem marca d\'água',
    ],
    cta: 'Assinar Pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    period: '',
    description: 'Para grandes equipes e demandas específicas',
    features: [
      'Tudo do Pro',
      'SSO e SAML',
      'Deploy on-premise',
      'SLA garantido',
      'Gerente de conta dedicado',
      'Treinamento personalizado',
      'API dedicada',
      'Auditoria e compliance',
    ],
    cta: 'Falar com Vendas',
    featured: false,
  },
];

const faqs = [
  { q: 'Posso mudar de plano depois?', a: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento.' },
  { q: 'Como funciona o período de teste?', a: 'O plano Free é totalmente gratuito e sem limite de tempo. Você pode testar todas as funcionalidades básicas.' },
  { q: 'O que acontece se eu exceder o limite do plano Free?', a: 'Seus workflows continuarão funcionando, mas você será notificado para fazer upgrade quando atingir 80% do limite.' },
  { q: 'Aceitam pagamento por boleto ou PIX?', a: 'Sim! Aceitamos cartão de crédito, PIX e boleto bancário para planos anuais.' },
];

export default function PrecoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">Planos Simples e Transparentes</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Comece grátis e escale conforme sua necessidade. Sem cartão de crédito necessário.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-8 ${
              plan.featured
                ? 'border-primary bg-gradient-to-b from-primary/5 to-transparent shadow-xl'
                : 'border-border bg-white'
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
                MAIS POPULAR
              </span>
            )}
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
            </div>
            <ul className="mb-8 space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <CheckoutButton
              plan={plan.name.toLowerCase()}
              featured={plan.featured}
            >
              {plan.cta}
            </CheckoutButton>
          </div>
        ))}
      </div>

      <section className="mx-auto mt-20 max-w-4xl">
        <h2 className="mb-8 text-center text-3xl font-bold">Perguntas Frequentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-white p-6">
              <h3 className="mb-2 font-semibold">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
