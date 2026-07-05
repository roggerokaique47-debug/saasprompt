import type { Metadata } from 'next';
import db from '@prompthub/database/src/client';
import { purchases } from '@prompthub/database/src/schema/purchases';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Vendas' };

export default async function AdminVendasPage() {
  const allPurchases = await db
    .select()
    .from(purchases)
    .orderBy(desc(purchases.createdAt))
    .limit(50);

  const totalRevenue = allPurchases.reduce((sum, p) => sum + p.amountCents, 0);
  const totalFees = allPurchases.reduce((sum, p) => sum + p.platformFeeCents, 0);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Vendas</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">Receita Total</p>
          <p className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">Taxas da Plataforma</p>
          <p className="text-2xl font-bold">${(totalFees / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">Total TransaÃ§Ãµes</p>
          <p className="text-2xl font-bold">{allPurchases.length}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Taxa</th>
              <th className="px-4 py-3 font-medium">Criador</th>
              <th className="px-4 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {allPurchases.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhuma venda ainda
                </td>
              </tr>
            )}
            {allPurchases.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 capitalize">{p.contentType}</td>
                <td className="px-4 py-3 font-medium">${(p.amountCents / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted-foreground">${(p.platformFeeCents / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted-foreground">${(p.creatorEarningsCents / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.createdAt.toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

