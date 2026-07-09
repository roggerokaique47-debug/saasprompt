import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/layout/logout-button';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { cookies } from 'next/headers';
import { AdBanner } from '@/components/monetization/ad-banner';
import { AdSidebar } from '@/components/monetization/ad-sidebar';
import { PlanTester } from '@/components/monetization/plan-tester';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ler o plano do usuário (usando o cookie simulador como fallback temporário para debug)
  const cookieStore = await cookies();
  const simulatedPlan = cookieStore.get('simulated_plan')?.value;
  // TODO: No futuro, isso puxará 'users.plan' do banco via Drizzle
  const isFreePlan = simulatedPlan !== 'premium';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0A0A0B]">
      <DashboardSidebar user={user} />

      {/* Main Content (Grid Condicional Baseado no Plano) */}
      <main className="flex flex-1 flex-col overflow-hidden relative z-0">
        <div className={`flex flex-1 overflow-hidden p-4 md:p-6 lg:p-8 gap-6 ${isFreePlan ? 'lg:flex-row flex-col' : 'flex-col'}`}>
          
          {/* Coluna Central (Conteúdo + Banner) */}
          <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar">
            {isFreePlan && (
              <div className="mb-6 shrink-0">
                <AdBanner />
              </div>
            )}
            <div className="flex-1">
              {children}
            </div>
          </div>

          {/* Coluna Direita (Ads - Apenas Free) */}
          {isFreePlan && (
            <aside className="hidden lg:block w-[300px] shrink-0 h-full overflow-y-auto no-scrollbar pb-8">
              <AdSidebar />
            </aside>
          )}

        </div>
      </main>

      {/* Easter Egg de Teste (Apenas em Dev) */}
      <PlanTester />
    </div>
  );
}
