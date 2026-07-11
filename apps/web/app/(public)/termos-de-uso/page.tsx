import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <ShieldCheck className="w-10 h-10 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Termos de Serviço</h1>
          <p className="text-sm text-zinc-500">Última atualização: Julho de 2026</p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p>
            Bem-vindo à <strong>NovaFlow AI</strong>. Ao acessar e utilizar nossa plataforma de automação B2B, você concorda com os presentes Termos de Serviço. Leia atentamente.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">1. Descrição dos Serviços</h2>
          <p>
            O NovaFlow AI fornece uma infraestrutura em nuvem (SaaS) que permite criar, gerenciar e executar fluxos de automação de inteligência artificial conectados a serviços de terceiros, como WhatsApp, Google Sheets, HubSpot e gateways de pagamento (Webhooks).
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">2. Uso e Consumo de Tokens (Créditos)</h2>
          <p>
            A execução de workflows e consumo de inteligência artificial é faturada através de um modelo de franquia de Tokens (Créditos).
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-zinc-400">
            <li>Tokens são deduzidos automaticamente de sua conta a cada execução bem-sucedida de um nó no motor de automação.</li>
            <li>Tokens não utilizados não são cumulativos para o mês seguinte (exceto no plano Lifetime, que possui recargas mensais não cumulativas limitadas ao teto do plano).</li>
            <li>A NovaFlow não se responsabiliza pelo consumo de tokens advindo de erros de lógica desenhados pelo próprio usuário.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">3. Serviços de Terceiros e APIs (Ex: WhatsApp)</h2>
          <p>
            O usuário entende e aceita que a NovaFlow AI utiliza APIs de terceiros para enviar e receber mensagens (ex: WhatsApp Web via WAHA). Não garantimos uptime absoluto sobre serviços que dependem de infraestruturas externas (como a Meta).
          </p>
          <p>
            <strong>É terminantemente proibido:</strong> Utilizar nossa plataforma para envio de spam em massa, golpes financeiros, assédio, ou violação das políticas do WhatsApp. Contas que violarem tais termos serão suspensas imediatamente, sem direito a estorno.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">4. Planos, Assinaturas e Estornos</h2>
          <p>
            Os pagamentos são processados pela Stripe. As renovações mensais ou anuais ocorrerão automaticamente até que o usuário realize o cancelamento através do painel de <em>Faturamento</em>. O estorno pode ser solicitado em até 7 (sete) dias corridos após a contratação, garantindo que a cota gasta não ultrapasse 15% do total de tokens do plano.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">5. Isenção de Garantias</h2>
          <p>
            O software é fornecido "no estado em que se encontra", sem garantia de qualquer tipo, expressa ou implícita. Não somos responsáveis por perda de lucro, interrupção de negócios ou perda de informações, advindos da indisponibilidade sistêmica.
          </p>
        </div>

        <div className="pt-10 border-t border-zinc-800 flex items-center justify-between">
          <Link href="/politica-de-privacidade" className="text-sm text-indigo-400 hover:underline">
            Ler Política de Privacidade &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
