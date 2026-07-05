import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { AdBanner, AdNative } from '@/components/ads/ad-banner';
import { PremiumGate } from '@/components/premium/premium-gate';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [wf] = await db
    .select()
    .from(workflows)
    .where(eq(workflows.slug, slug))
    .limit(1);

  if (!wf) return { title: 'Workflow não encontrado' };

  return {
    title: `${wf.title} — n8n Workflow`,
    description: wf.description ?? '',
  };
}

export default async function WorkflowPage({ params }: PageProps) {
  const { slug } = await params;

  const [wf] = await db
    .select()
    .from(workflows)
    .where(eq(workflows.slug, slug))
    .limit(1);

  if (!wf || !wf.isPublished) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/workflows"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        ← Workflows
      </Link>

      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {wf.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
          <span className="text-xs text-muted-foreground">
            n8n v{wf.n8nVersion}
          </span>
          {wf.isPremium && (
            <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground">
              Premium — ${(wf.priceCents / 100).toFixed(2)}
            </span>
          )}
        </div>

        <h1 className="mb-2 text-3xl font-bold">{wf.title}</h1>
        {wf.description && (
          <p className="mb-4 text-lg text-muted-foreground">{wf.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{wf.downloads} downloads</span>
          <span>{wf.views} visualizações</span>
        </div>
      </div>

      <AdBanner className="mb-6" />

      <PremiumGate
        contentType="workflow"
        contentId={wf.id}
        priceCents={wf.isPremium ? wf.priceCents : 0}
        title={wf.title}
      >
        <div className="mb-6 rounded-xl border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-6 py-3">
            <span className="text-sm font-medium text-muted-foreground">
              Workflow JSON
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const blob = new Blob(
                    [JSON.stringify(wf.workflowJson, null, 2)],
                    { type: 'application/json' },
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${wf.slug}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
              >
                📥 Download JSON
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(wf.workflowJson, null, 2))}
                className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium hover:bg-muted"
              >
                📋 Copiar
              </button>
            </div>
          </div>
          <div className="overflow-x-auto p-6">
            <pre className="max-h-96 overflow-y-auto font-mono text-xs leading-relaxed">
              {JSON.stringify(wf.workflowJson, null, 2)}
            </pre>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Como usar este workflow</h3>
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            <li>Copie o JSON acima ou clique em Download</li>
            <li>Abra seu n8n (n8n.io ou self-hosted)</li>
            <li>Vá em Workflows &gt; Importar</li>
            <li>Cole o JSON ou selecione o arquivo</li>
            <li>Configure as credenciais necessárias</li>
            <li>Ative o workflow!</li>
          </ol>
        </div>
      </PremiumGate>

      <AdNative className="mt-8" />
    </main>
  );
}
