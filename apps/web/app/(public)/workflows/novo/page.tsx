import type { Metadata } from 'next';
import { WorkflowEditor } from '@/components/workflow-editor';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Novo Workflow - NovaFlow AI',
  description: 'Crie um novo workflow de automacao',
};

export default async function NovoWorkflowPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return <WorkflowEditor />;
}
