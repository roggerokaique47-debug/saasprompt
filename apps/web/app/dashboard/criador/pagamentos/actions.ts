'use server';

import db from '@prompthub/database/src/client';
import { payouts } from '@prompthub/database/src/schema/payouts';

export async function requestPayout(
  _prevState: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const creatorId = formData.get('creatorId') as string;
  const amountCents = parseInt(formData.get('amountCents') as string, 10);

  if (!creatorId || !amountCents) {
    return { error: 'Dados inválidos' };
  }

  if (amountCents < 1000) {
    return { error: 'Valor mínimo para saque é $10.00' };
  }

  try {
    await db.insert(payouts).values({
      creatorId,
      amountCents,
      status: 'pending',
    });
    return { error: '' };
  } catch {
    return { error: 'Erro ao solicitar saque. Tente novamente.' };
  }
}
