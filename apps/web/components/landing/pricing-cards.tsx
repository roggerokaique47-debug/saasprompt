'use client';

import { motion, Variants } from 'framer-motion';
import { CheckoutButton } from '@/components/checkout-button';

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
      "Sem marca d'água",
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export function PricingCards() {
  return (
    <div className="relative mx-auto w-full max-w-6xl">
      {/* Background Glow Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[10%] top-[20%] h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[10%] top-[40%] h-96 w-96 rounded-full bg-violet-500/20 blur-[100px]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-8 md:grid-cols-3"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={`relative flex flex-col rounded-3xl border p-8 backdrop-blur-xl ${
              plan.featured
                ? 'border-primary/50 bg-white/60 shadow-2xl dark:bg-black/60'
                : 'border-border/50 bg-white/40 shadow-lg dark:bg-zinc-900/40'
            }`}
          >
            {plan.featured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-white/20"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                </span>
                MAIS POPULAR
              </motion.div>
            )}

            <div className="mb-6 flex-1">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">{plan.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
              {plan.period && <span className="ml-1 text-sm font-medium text-muted-foreground">{plan.period}</span>}
            </div>

            <ul className="mb-8 flex-1 space-y-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <CheckoutButton
                plan={plan.name.toLowerCase()}
                featured={plan.featured}
              >
                {plan.cta}
              </CheckoutButton>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
