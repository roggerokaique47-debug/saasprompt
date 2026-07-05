import type { Metadata } from 'next';
import Link from 'next/link';
import { WorkflowForm } from '@/components/workflows/workflow-form';

export const metadata: Metadata = {
  title: 'Publicar Workflow n8n',
};

export default function NovoWorkflowPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/workflows"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        ← Workflows
      </Link>
      <h1 className="mb-8 text-3xl font-bold">Publicar Workflow n8n</h1>
      <WorkflowForm />
    </main>
  );
}
