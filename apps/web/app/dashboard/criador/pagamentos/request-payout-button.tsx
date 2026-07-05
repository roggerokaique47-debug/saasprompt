'use client';

import { useActionState } from 'react';
import { requestPayout } from './actions';

export function RequestPayoutButton({
  availableBalanceCents,
  creatorId,
}: {
  availableBalanceCents: number;
  creatorId: string;
}) {
  const [state, formAction, pending] = useActionState(requestPayout, { error: '' });

  return (
    <form action={formAction}>
      <input type="hidden" name="creatorId" value={creatorId} />
      <input type="hidden" name="amountCents" value={availableBalanceCents} />
      <button
        type="submit"
        disabled={pending || availableBalanceCents < 1000}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? 'Solicitando...' : 'Solicitar Saque'}
      </button>
      {availableBalanceCents < 1000 && (
        <p className="mt-1 text-xs text-muted-foreground">
          Mínimo de $10.00 para saque
        </p>
      )}
      {state?.error && (
        <p className="mt-1 text-xs text-red-500">{state.error}</p>
      )}
    </form>
  );
}
