import type { Metadata } from 'next';
import db from '@prompthub/database/src/client';
import { payouts } from '@prompthub/database/src/schema/payouts';
import { sales } from '@prompthub/database/src/schema/sales';
import { eq, desc, and, sql } from 'drizzle-orm';
import { getCurrentCreator } from '@/features/creator/creator-actions';
import { RequestPayoutButton } from './request-payout-button';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Pagamentos' };

export default async function CreatorPagamentosPage() {
  const { creator } = await getCurrentCreator();

  const [earnings] = await db
    .select({
      totalEarnings: sql<number>`coalesce(sum(${sales.creatorEarningsCents}), 0)`,
    })
    .from(sales)
    .where(eq(sales.creatorId, creator.id));

  const [paidResult] = await db
    .select({
      totalPaid: sql<number>`coalesce(sum(${payouts.amountCents}), 0)`,
    })
    .from(payouts)
    .where(and(eq(payouts.creatorId, creator.id), eq(payouts.status, 'paid')));

  const allPayouts = await db
    .select()
    .from(payouts)
    .where(eq(payouts.creatorId, creator.id))
    .orderBy(desc(payouts.requestedAt));

  const availableBalance = (earnings?.totalEarnings ?? 0) - (paidResult?.totalPaid ?? 0);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pagamentos</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">Ganhos Totais</p>
          <p className="text-2xl font-bold">${((earnings?.totalEarnings ?? 0) / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">Total Recebido</p>
          <p className="text-2xl font-bold">${((paidResult?.totalPaid ?? 0) / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">Disponível para Saque</p>
          <p className="text-2xl font-bold">${(availableBalance / 100).toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Histórico de Saques</h2>
        <RequestPayoutButton
          availableBalanceCents={availableBalance}
          creatorId={creator.id}
        />
      </div>

      <div className="rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Solicitado em</th>
              <th className="px-4 py-3 font-medium">Processado em</th>
              <th className="px-4 py-3 font-medium">Notas</th>
            </tr>
          </thead>
          <tbody>
            {allPayouts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum saque solicitado
                </td>
              </tr>
            )}
            {allPayouts.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">${(p.amountCents / 100).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.status === 'paid' ? 'bg-green-100 text-green-800' :
                    p.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    p.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {p.status === 'paid' ? 'Pago' :
                     p.status === 'approved' ? 'Aprovado' :
                     p.status === 'rejected' ? 'Rejeitado' :
                     'Pendente'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(p.requestedAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.processedAt ? new Date(p.processedAt).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.notes ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
