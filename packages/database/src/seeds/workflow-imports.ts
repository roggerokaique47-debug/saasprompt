import fs from 'fs';
import path from 'path';

interface ExternalWorkflow {
  title: string;
  slug: string;
  description: string;
  categorySlug: string;
  tags: string[];
  isPremium: boolean;
  priceCents: number;
  source: string;
  filename: string;
}

export const externalWorkflows: ExternalWorkflow[] = [
  {
    title: 'AI WordPress Post Maker',
    slug: 'ai-wordpress-post-maker',
    description: 'Gera artigos para blog com IA, cria imagens com DALL-E e publica automaticamente no WordPress.',
    categorySlug: 'automacao',
    tags: ['wordpress', 'ia', 'blog', 'dalle', 'conteudo'],
    isPremium: true, priceCents: 2499,
    source: 'jipraks/n8n-templates',
    filename: 'ai-wordpress-post-maker.json',
  },
  {
    title: 'E-commerce Chatbot com IA',
    slug: 'ecommerce-chatbot-ia',
    description: 'Chatbot inteligente para e-commerce que tira dúvidas, recomenda produtos e finaliza vendas.',
    categorySlug: 'marketing-wf',
    tags: ['chatbot', 'ecommerce', 'ia', 'vendas'],
    isPremium: true, priceCents: 3499,
    source: 'jipraks/n8n-templates',
    filename: 'shopping-ecommerce-chatbot.json',
  },
  {
    title: 'Agente SSH com IA para DevOps',
    slug: 'agente-ssh-devops-ia',
    description: 'Agente AI que acessa servidores via SSH, executa comandos e diagnostica problemas automaticamente.',
    categorySlug: 'automacao',
    tags: ['ssh', 'devops', 'ia', 'servidor'],
    isPremium: true, priceCents: 1999,
    source: 'jipraks/n8n-templates',
    filename: 'ssh-ai-agent.json',
  },
  {
    title: 'WhatsApp AI + Google Agenda',
    slug: 'whatsapp-ia-google-agenda',
    description: 'Assistente no WhatsApp que gerencia compromissos no Google Agenda usando IA.',
    categorySlug: 'integracao',
    tags: ['whatsapp', 'google-calendar', 'ia', 'agenda'],
    isPremium: true, priceCents: 1499,
    source: 'jipraks/n8n-templates',
    filename: 'whatsapp-ai-google-calendar.json',
  },
  {
    title: 'Agente de Suporte Chatwoot com IA',
    slug: 'chatwoot-agente-ia',
    description: 'Agente AI integrado ao Chatwoot para responder clientes automaticamente com suporte inteligente.',
    categorySlug: 'notificacao',
    tags: ['chatwoot', 'suporte', 'ia', 'atendimento'],
    isPremium: false, priceCents: 0,
    source: 'jipraks/n8n-templates',
    filename: 'chatwoot-ai-agent.json',
  },
  {
    title: 'Migração Google Sheets → Data Tables',
    slug: 'migracao-google-sheets-data-tables',
    description: 'Migra dados do Google Sheets para Data Tables do n8n com verificação de duplicatas.',
    categorySlug: 'integracao',
    tags: ['google-sheets', 'data-tables', 'migracao', 'dados'],
    isPremium: false, priceCents: 0,
    source: 'jipraks/n8n-templates',
    filename: 'google-sheets-to-data-tables-migration.json',
  },
  {
    title: 'Agente de Voz com IA (MAIA Router)',
    slug: 'agente-voz-ia-maia',
    description: 'Agente de voz com IA usando MAIA Router para atendimento telefônico automatizado.',
    categorySlug: 'integracao',
    tags: ['voz', 'ia', 'telefone', 'maia'],
    isPremium: true, priceCents: 3999,
    source: 'jipraks/n8n-templates',
    filename: 'voice-ai-agent-maia-router.json',
  },
  {
    title: 'Monitor de Preços Online',
    slug: 'monitor-precos-online',
    description: 'Monitora preços de produtos em lojas online e dispara alertas quando há queda.',
    categorySlug: 'notificacao',
    tags: ['monitor', 'preco', 'scraping', 'alerta'],
    isPremium: false, priceCents: 0,
    source: 'jipraks/n8n-templates',
    filename: 'scrap-mitra10-price.json',
  },
  {
    title: 'Contadoria Automática com IA (ERPNext)',
    slug: 'contadoria-automatica-ia',
    description: 'Gera lançamentos contábeis no ERPNext automaticamente usando IA a partir de descrições de transações.',
    categorySlug: 'automacao',
    tags: ['contabilidade', 'erpnext', 'ia', 'financeiro'],
    isPremium: true, priceCents: 2999,
    source: 'jipraks/n8n-templates',
    filename: 'ai-accounting-staff.json',
  },
  {
    title: 'Chatbot de Frete com IA',
    slug: 'chatbot-frete-ia',
    description: 'Chatbot que calcula fretes e responde dúvidas sobre entregas usando IA.',
    categorySlug: 'marketing-wf',
    tags: ['chatbot', 'frete', 'ecommerce', 'logistica'],
    isPremium: false, priceCents: 0,
    source: 'jipraks/n8n-templates',
    filename: 'biteship-ongkir-chatbot.json',
  },
];

export function loadExternalWorkflowJson(filename: string): object | null {
  const filePath = path.resolve(__dirname, 'workflows', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ Workflow file not found: ${filename}`);
    return null;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}
