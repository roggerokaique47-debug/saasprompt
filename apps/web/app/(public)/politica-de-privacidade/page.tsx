import React from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <Lock className="w-10 h-10 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Política de Privacidade</h1>
          <p className="text-sm text-zinc-500">Última atualização: Julho de 2026</p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p>
            A privacidade e a segurança dos dados dos nossos clientes são nossa maior prioridade na <strong>NovaFlow AI</strong>. Elaboramos esta política para explicar como coletamos, usamos, protegemos e tratamos seus dados em conformidade com a <strong>LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018)</strong>.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">1. Dados Coletados</h2>
          <p>Coletamos os seguintes tipos de informações:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-zinc-400">
            <li><strong>Dados de Conta:</strong> Nome, e-mail e dados de pagamento processados com segurança pelo gateway Stripe.</li>
            <li><strong>Dados de Integração (Chaves BYOK):</strong> Tokens de API (OpenAI, HubSpot) fornecidos pelo cliente não são armazenados em texto plano. As instâncias e fluxos pertencem e são isoladas exclusivamente na sessão do seu <code>Tenant ID</code>.</li>
            <li><strong>Logs de Execução (Engine):</strong> Retemos logs curtos de execução de Webhooks apenas para diagnóstico e estorno de falhas de processamento. Tais logs são expurgados rotineiramente e são isolados por ambiente multi-tenant.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">2. Compartilhamento de Informações</h2>
          <p>
            Nós não vendemos, alugamos ou comercializamos seus dados pessoais. O compartilhamento ocorre estritamente com os provedores de infraestrutura necessários ao funcionamento da plataforma (ex: Supabase para banco de dados, AWS/Vercel para hospedagem).
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">3. Direitos do Titular dos Dados (Você)</h2>
          <p>Sob a LGPD, você tem os seguintes direitos (bastando abrir um ticket no menu "Ajuda"):</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-zinc-400">
            <li>Confirmação da existência de tratamento.</li>
            <li>Acesso aos dados ou portabilidade de seus fluxos desenhados.</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">4. Retenção e Exclusão Segura</h2>
          <p>
            Em caso de encerramento de conta, mantemos seus dados de faturamento arquivados apenas pelo prazo exigido pela legislação fiscal aplicável. Os tokens de integração e webhooks são purgados do nosso motor central no momento da rescisão.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">5. Segurança da Informação</h2>
          <p>
            Implementamos camadas de segurança como encriptação SSL/TLS, Políticas Multi-tenant de nível de linha (RLS) no banco de dados Supabase e autenticação forte OAuth para blindar os endpoints contra interceptação ou acessos cruzados não autorizados.
          </p>
        </div>

        <div className="pt-10 border-t border-zinc-800 flex items-center justify-between">
          <Link href="/termos-de-uso" className="text-sm text-indigo-400 hover:underline">
            &larr; Voltar para Termos de Uso
          </Link>
        </div>

      </div>
    </div>
  );
}
