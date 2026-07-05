import type { Metadata } from 'next';
import db from '@prompthub/database/src/client';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { count, avg, eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function AdminDashboard() {
  const [totalPrompts] = await db
    .select({ value: count() })
    .from(prompts);

  const [avgRating] = await db
    .select({ value: avg(prompts.ratingAvg) })
    .from(prompts)
    .where(eq(prompts.isPublished, true));

  const [totalFeatured] = await db
    .select({ value: count() })
    .from(prompts)
    .where(eq(prompts.isFeatured, true));

  const [totalDownloads] = await db
    .select({ value: sql<number>`cast(sum(${prompts.downloads}) as int)` })
    .from(prompts);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de Prompts"
          value={totalPrompts?.value?.toString() ?? '0'}
        />
        <StatCard
          label="AvaliaÃ§Ã£o MÃ©dia"
          value={Number(avgRating?.value ?? 0).toFixed(1)}
        />
        <StatCard
          label="Em Destaque"
          value={totalFeatured?.value?.toString() ?? '0'}
        />
        <StatCard
          label="Total Downloads"
          value={totalDownloads?.value?.toString() ?? '0'}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}

