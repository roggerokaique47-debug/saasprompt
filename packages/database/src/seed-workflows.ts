import { v4 as uuidv4 } from 'uuid';
import db from './client';
import { workflows } from './schema/workflows';
import { organizations } from './schema/organizations';

const realWorkflows = [
  {
    title: 'Atendimento via WhatsApp (NovaFlow)',
    slug: 'atendimento-whatsapp',
    description: 'Automatize todo o seu funil de atendimento e suporte utilizando a inteligência artificial integrada ao WhatsApp. Responda clientes 24/7 de forma humana e rápida.',
    isPublished: true,
    isPremium: false,
    priceCents: 0,
    downloads: 4532,
    tags: ['WhatsApp', 'Atendimento', 'IA'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Automação de Marketing (NovaFlow)',
    slug: 'automacao-marketing',
    description: 'Crie campanhas dinâmicas que adaptam a comunicação com o lead dependendo do engajamento dele, maximizando a sua taxa de conversão.',
    isPublished: true,
    isPremium: true,
    priceCents: 9900,
    downloads: 1245,
    tags: ['Marketing', 'Vendas', 'Automação'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Automação de Suporte Técnico (NovaFlow)',
    slug: 'automacao-suporte',
    description: 'Reduza a fila de chamados técnicos utilizando agentes de IA treinados na sua própria base de conhecimento. Resolve dúvidas frequentes automaticamente.',
    isPublished: true,
    isPremium: false,
    priceCents: 0,
    downloads: 8740,
    tags: ['Suporte', 'Helpdesk'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Automação de Vendas (NovaFlow)',
    slug: 'automacao-vendas',
    description: 'Qualifique leads e faça follow-up ativo de oportunidades comerciais, integrando seu CRM e acelerando o fechamento.',
    isPublished: true,
    isPremium: true,
    priceCents: 14900,
    downloads: 310,
    tags: ['Vendas', 'CRM', 'IA'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Recuperação de Vendas e Carrinhos (NovaFlow)',
    slug: 'recuperacao-vendas',
    description: 'Detecte carrinhos abandonados ou compras não concluídas e acione os clientes de imediato com ofertas para concluir a venda.',
    isPublished: true,
    isPremium: true,
    priceCents: 7900,
    downloads: 985,
    tags: ['Vendas', 'E-commerce', 'Recuperação'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Integração Google Sheets',
    slug: 'google-sheets-sync',
    description: 'Sincronize respostas e leads capturados pelo NovaFlow diretamente em planilhas do Google Sheets em tempo real.',
    isPublished: true,
    isPremium: false,
    priceCents: 0,
    downloads: 5012,
    tags: ['Integrações', 'Google'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Integração Shopify',
    slug: 'shopify-sync',
    description: 'Conecte sua loja Shopify para que a IA consiga recomendar produtos e enviar links de checkout direto pelo chat.',
    isPublished: true,
    isPremium: true,
    priceCents: 4900,
    downloads: 1102,
    tags: ['E-commerce', 'Shopify'],
    nodes: [],
    edges: [],
  }
];

async function seed() {
  console.log('🌱 Iniciando seed de workflows do NovaFlow AI com dados reais...');

  try {
    const orgId = uuidv4();
    await db.insert(organizations).values({
      id: orgId,
      name: 'Default NovaFlow Org',
      slug: 'default-novaflow-org-' + orgId.substring(0, 8),
      ownerId: uuidv4(), // just a dummy owner for seed
      credits: 100,
    }).onConflictDoNothing();

    for (const wf of realWorkflows) {
      const authorId = uuidv4();
      
      const { nodes, edges, ...restWf } = wf;

      await db.insert(workflows).values({
        id: uuidv4(),
        authorId: authorId,
        organizationId: orgId,
        ...restWf,
        workflowJson: { nodes, edges } as any,
      });
      console.log(`✅ Inserido: ${wf.title}`);
    }

    console.log('🎉 Seed do NovaFlow concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    process.exit(0);
  }
}

seed();
