'use client';

import { useState } from 'react';
import { createSubscriptionCheckout } from '@/features/purchase/subscription-actions';
import { useRouter } from 'next/navigation';

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
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex w-full items-center justify-center rounded-xl py-4 font-semibold transition-all ${
        featured
          ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg disabled:opacity-50'
          : 'border border-border bg-white hover:bg-muted disabled:opacity-50'
      } ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Processando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
