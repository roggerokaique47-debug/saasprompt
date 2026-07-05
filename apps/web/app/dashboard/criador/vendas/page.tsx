import type { Metadata } from 'next';
import db from '@prompthub/database/src/client';
import { sales } from '@prompthub/database/src/schema/sales';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { eq, desc, sql } from 'drizzle-orm';
import { getCurrentCreator } from '@/features/creator/creator-actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Vendas' };

export default async function CreatorVendasPage() {
  const { creator } = await getCurrentCreator();

  const [summary] = await db
    .select({
      totalSales: sql<number>`coalesce(count(*), 0)`,
      totalRevenue: sql<number>`coalesce(sum(${sales.amountCents}), 0)`,
      totalFees: sql<number>`coalesce(sum(${sales.platformFeeCents}), 0)`,
      totalEarnings: sql<number>`coalesce(sum(${sales.creatorEarningsCents}), 0)`,
    })
    .from(sales)
    .where(eq(sales.creatorId, creator.id));

  const allSales = await db
    .select({
      id: sales.id,
      amountCents: sales.amountCents,
      platformFeeCents: sales.platformFeeCents,
      creatorEarningsCents: sales.creatorEarningsCents,
      stripePaymentIntent: sales.stripePaymentIntent,
      createdAt: sales.createdAt,
      promptTitle: prompts.title,
      promptSlug: prompts.slug,
    })
    .from(sales)
    .leftJoin(prompts, eq(sales.promptId, prompts.id))
    .where(eq(sales.creatorId, creator.id))
    .orderBy(desc(sales.createdAt));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Histórico de Vendas</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">Receita Bruta</p>
          <p className="text-2xl font-bold">${((summary?.totalRevenue ?? 0) / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">Taxa da Plataforma (30%)</p>
          <p className="text-2xl font-bold">${((summary?.totalFees ?? 0) / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">Seus Ganhos</p>
          <p className="text-2xl font-bold">${((summary?.totalEarnings ?? 0) / 100).toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Prompt</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Taxa</th>
              <th className="px-4 py-3 font-medium">Seu Ganho</th>
              <th className="px-4 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {allSales.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhuma venda ainda
                </td>
              </tr>
            )}
            {allSales.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  {s.promptTitle}
                </td>
                <td className="px-4 py-3 font-medium">${(s.amountCents / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted-foreground">${(s.platformFeeCents / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted-foreground">${(s.creatorEarningsCents / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(s.createdAt).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
