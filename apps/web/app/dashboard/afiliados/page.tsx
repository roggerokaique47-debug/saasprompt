import React from 'react';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { affiliates, affiliateReferrals } from '@prompthub/database/src/schema/affiliates';
import { eq, desc } from 'drizzle-orm';
import { Zap, Link as LinkIcon, DollarSign, Users, ExternalLink } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AfiliadosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Verifica se o usuário já é afiliado
  let affiliateData = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.userId, user.id))
    .limit(1)
    .then(res => res[0]);

  let referrals: any[] = [];

  // Se não for afiliado, não cria automaticamente ainda (precisa clicar em "Quero ser afiliado").
  // Mas para testes, se o usuário já tiver o link, buscamos os referrals.
  if (affiliateData) {
    referrals = await db
      .select()
      .from(affiliateReferrals)
      .where(eq(affiliateReferrals.affiliateId, affiliateData.id))
      .orderBy(desc(affiliateReferrals.createdAt));
  }

  // URL Base para o link de indicação
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const referralLink = affiliateData ? `${baseUrl}/cadastro?ref=${affiliateData.referralCode}` : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Zap className="w-8 h-8 mr-3 text-amber-500" />
            Programa de Afiliados
          </h1>
          <p className="text-zinc-400 mt-1">
            Indique a NovaFlow para outras agências e ganhe 30% de comissão recorrente.
          </p>
        </div>
      </div>

      {!affiliateData ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-2xl mx-auto mt-12">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Você ainda não é um afiliado</h2>
          <p className="text-zinc-400 mb-8">
            Torne-se um parceiro oficial da NovaFlow. A cada venda gerada pelo seu link, você recebe 30% do valor da assinatura, todos os meses.
          </p>
          <form action={async () => {
            'use server';
            const supabaseServer = await createClient();
            const { data: { user } } = await supabaseServer.auth.getUser();
            if (user) {
              const code = Math.random().toString(36).substring(2, 8).toUpperCase();
              await db.insert(affiliates).values({
                userId: user.id,
                referralCode: code,
              });
            }
          }}>
            <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)]">
              Quero ser Afiliado
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Painel do Afiliado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 font-medium">Link de Indicação</h3>
                <LinkIcon className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-3 rounded-xl overflow-hidden">
                <span className="text-sm text-zinc-300 truncate flex-1">{referralLink}</span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 font-medium">Ganhos Totais</h3>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-white">
                R$ {(affiliateData.totalEarningsCents / 100).toFixed(2).replace('.', ',')}
              </div>
              <p className="text-sm text-emerald-500 mt-2">Pronto para saque</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 font-medium">Cadastros Gerados</h3>
                <Users className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-bold text-white">
                {referrals.length}
              </div>
              <p className="text-sm text-zinc-500 mt-2">{referrals.filter(r => r.status === 'converted').length} convertidos</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mt-8">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Histórico de Indicações</h3>
            </div>
            
            {referrals.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-zinc-500">Você ainda não indicou ninguém. Compartilhe seu link e comece a faturar!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-zinc-950/50 text-xs uppercase border-b border-zinc-800">
                    <tr>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((ref) => (
                      <tr key={ref.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                        <td className="px-6 py-4">{new Date(ref.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          {ref.status === 'converted' ? (
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium">Convertido</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-medium">Pendente</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-emerald-400 font-medium">
                          R$ {(ref.commissionCents / 100).toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
