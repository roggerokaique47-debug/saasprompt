import { notFound } from 'next/navigation';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { eq } from 'drizzle-orm';
import { WorkflowEditor } from '@/components/workflow-editor';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { WorkflowDefinition } from '@prompthub/engine';

export default async function WorkflowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { slug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  const [workflow] = await db
    .select()
    .from(workflows)
    .where(isUuid ? eq(workflows.id, slug) : eq(workflows.slug, slug))
    .limit(1);

  if (!workflow) notFound();

  return (
    <WorkflowEditor
      initialWorkflow={workflow.workflowJson as unknown as WorkflowDefinition}
    />
  );
}
