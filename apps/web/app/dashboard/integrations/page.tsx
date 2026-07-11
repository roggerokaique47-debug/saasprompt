import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { IntegrationsHub } from '@/features/integrations/components/integrations-hub';

export const metadata: Metadata = {
  title: 'Integrações - NovaFlow AI',
  description: 'Gerencie suas integrações e chaves de API conectadas.',
};

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
        <p className="text-muted-foreground mt-2">
          Conecte ferramentas externas e gerencie suas chaves de API (BYOK) para as automações.
        </p>
      </div>

      <div className="flex-1 rounded-xl bg-white p-6 md:p-10">
        <IntegrationsHub userId={user.id} />
      </div>
    </div>
  );
}
