import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { WahaConnector } from '@/features/whatsapp/components/waha-connector';

export const metadata: Metadata = {
  title: 'WhatsApp - NovaFlow AI',
  description: 'Conecte seu WhatsApp para habilitar integrações automáticas.',
};

export default async function WhatsappPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp</h1>
        <p className="text-muted-foreground mt-2">
          Conecte o seu número para habilitar o envio e recebimento de mensagens através dos seus workflows.
        </p>
      </div>

      <div className="flex-1 rounded-xl bg-white p-6 md:p-10">
        <WahaConnector userId={user.id} />
      </div>
    </div>
  );
}
