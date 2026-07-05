'use client';

import { useActionState } from 'react';
import { createContentCheckoutSession } from '@/features/purchase';

export function BuyButton({
  contentType,
  contentId,
  priceCents,
  title,
}: {
  contentType: 'prompt' | 'article' | 'workflow';
  contentId: string;
  priceCents: number;
  title: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null) => {
      const result = await createContentCheckoutSession(
        contentType,
        contentId,
        priceCents,
        title,
      );
      if (result.url) {
        window.location.href = result.url;
        return null;
      }
      return result.error ? { error: result.error } : null;
    },
    null,
  );

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-8 py-3 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'Redirecionando...' : `Comprar por $${(priceCents / 100).toFixed(2)}`}
      </button>
      {state?.error && (
        <p className="mt-2 text-sm text-error">{state.error}</p>
      )}
    </form>
  );
}
