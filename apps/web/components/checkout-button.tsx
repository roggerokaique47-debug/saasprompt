'use client';

import { useState } from 'react';
import { createSubscriptionCheckout } from '@/features/purchase/subscription-actions';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface CheckoutButtonProps {
  plan: string;
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
}

export function CheckoutButton({ plan, children, className = '', featured }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (plan === 'free') {
      router.push('/cadastro');
      return;
    }

    if (plan === 'enterprise') {
      window.location.href = 'mailto:vendas@novaflow.ai';
      return;
    }

    setLoading(true);
    const result = await createSubscriptionCheckout(plan);

    if (result.url) {
      window.location.href = result.url;
    } else {
      if (result.error?.includes('autenticado')) {
        router.push('/login');
      } else {
        alert(result.error || 'Erro ao iniciar checkout');
      }
    }
    setLoading(false);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      disabled={loading}
      className={`relative flex w-full items-center justify-center rounded-xl py-4 font-semibold transition-colors overflow-hidden ${
        featured
          ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg disabled:opacity-50'
          : 'border border-border bg-white hover:bg-slate-50 disabled:opacity-50'
      } ${className}`}
    >
      {featured && (
        <motion.div
          className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processando...
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}
