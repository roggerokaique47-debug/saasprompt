import type { Metadata } from 'next';
import db from '@prompthub/database/src/client';
import { sales } from '@prompthub/database/src/schema/sales';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { articles } from '@prompthub/database/src/schema/articles';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { payouts } from '@prompthub/database/src/schema/payouts';
import { count, desc, sql, sum, and, eq } from 'drizzle-orm';
import { getCurrentCreator } from '@/features/creator';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Painel do Criador',
};

export default async function CreatorDashboardPage() {
  const { user, creator } = await getCurrentCreator();

  const [earnings] = await db
    .select({
      totalSales: count(),
      totalRevenue: sql<number>`coalesce(sum(${sales.amountCents}), 0)`,
      totalFees: sql<number>`coalesce(sum(${sales.platformFeeCents}), 0)`,
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

  const [pendingResult] = await db
    .select({
      totalPending: sql<number>`coalesce(sum(${payouts.amountCents}), 0)`,
    })
    .from(payouts)
    .where(and(eq(payouts.creatorId, creator.id), eq(payouts.status, 'pending')));

  const pendingBalance = (earnings?.totalEarnings ?? 0) - (paidResult?.totalPaid ?? 0);
  const pendingPayout = pendingResult?.totalPending ?? 0;

  const totalPrompts = await db
    .select({ value: count() })
    .from(prompts)
    .where(eq(prompts.authorId, user.id));

  const totalArticles = await db
    .select({ value: count() })
    .from(articles)
    .where(eq(articles.authorId, user.id));

  const totalWorkflows = await db
    .select({ value: count() })
    .from(workflows)
    .where(eq(workflows.authorId, user.id));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user.user_metadata?.name ?? user.email}!</h1>
          <p className="text-muted-foreground">{creator.bio}</p>
        </div>
        <Link
          href="/comunidade"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Novo Conteúdo
        </Link>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Conteúdos" value={((totalPrompts[0]?.value ?? 0) + (totalArticles[0]?.value ?? 0) + (totalWorkflows[0]?.value ?? 0)).toString()} sub="prompts + artigos + workflows" />
        <StatCard label="Vendas Realizadas" value={earnings?.totalSales?.toString() ?? '0'} />
        <StatCard label="Receita Bruta" value={`$${((earnings?.totalRevenue ?? 0) / 100).toFixed(2)}`} />
        <StatCard label="Saldo Disponível" value={`$${(pendingBalance / 100).toFixed(2)}`} sub={`${(pendingPayout / 100).toFixed(2)} em saque`} />
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold">Seus Conteúdos Recentes</h2>
        <RecentContent userId={user.id} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Últimas Vendas</h2>
        <RecentSales creatorId={creator.id} />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

async function RecentContent({ userId }: { userId: string }) {
  const recentPrompts = await db
    .select({ id: prompts.id, title: prompts.title, slug: prompts.slug, type: sql<string>`'prompt'`.as('type'), createdAt: prompts.createdAt })
    .from(prompts)
    .where(eq(prompts.authorId, userId))
    .orderBy(desc(prompts.createdAt))
    .limit(5);

  if (recentPrompts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 text-center">
        <p className="text-muted-foreground">Você ainda não publicou nenhum conteúdo.</p>
        <Link href="/comunidade" className="mt-2 inline-block text-sm text-primary hover:underline">
          Publicar agora
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {recentPrompts.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <Link href={`/${item.type === 'workflow' ? 'workflows' : item.type === 'article' ? 'artigos' : item.type === 'prompt' ? 'prompt' : 'prompt'}/${item.slug}`} className="hover:text-primary">
                  {item.title}
                </Link>
              </td>
              <td className="px-4 py-3 capitalize">{item.type}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function RecentSales({ creatorId }: { creatorId: string }) {
  const recentSales = await db
    .select({
      id: sales.id,
      amountCents: sales.amountCents,
      creatorEarningsCents: sales.creatorEarningsCents,
      createdAt: sales.createdAt,
      promptTitle: prompts.title,
      promptSlug: prompts.slug,
    })
    .from(sales)
    .leftJoin(prompts, eq(sales.promptId, prompts.id))
    .where(eq(sales.creatorId, creatorId))
    .orderBy(desc(sales.createdAt))
    .limit(5);

  if (recentSales.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 text-center">
        <p className="text-muted-foreground">Nenhuma venda ainda.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-medium">Prompt</th>
            <th className="px-4 py-3 font-medium">Valor</th>
            <th className="px-4 py-3 font-medium">Seu Ganho</th>
            <th className="px-4 py-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {recentSales.map((s) => (
            <tr key={s.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                {s.promptTitle && (
                  <Link href={`/prompt/${s.promptSlug}`} className="hover:text-primary">
                    {s.promptTitle}
                  </Link>
                )}
              </td>
              <td className="px-4 py-3 font-medium">${(s.amountCents / 100).toFixed(2)}</td>
              <td className="px-4 py-3 text-muted-foreground">${(s.creatorEarningsCents / 100).toFixed(2)}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(s.createdAt).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
