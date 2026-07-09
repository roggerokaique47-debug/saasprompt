import { v4 as uuidv4 } from 'uuid';
import db from './client';
import { workflows } from './schema/workflows';

const realWorkflows = [
  {
    title: 'Anthropic / Documentação e PDF',
    slug: 'anthropic-pdf-docs',
    description: 'Extraia texto de PDFs e gere documentação de forma automatizada com a API da Anthropic.',
    isPublished: true,
    isPremium: true,
    priceCents: 4900,
    downloads: 12543,
    tags: ['Documentos', 'IA', 'Anthropic'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Stripe / Best Practices',
    slug: 'stripe-best-practices',
    description: 'Workflows de boas práticas para integração de pagamentos e assinaturas com Stripe.',
    isPublished: true,
    isPremium: false,
    priceCents: 0,
    downloads: 9234,
    tags: ['Pagamentos', 'Financeiro'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Vercel / Next.js Workflow',
    slug: 'vercel-nextjs-workflow',
    description: 'Automatize upgrades de versão e deploy no ecossistema Vercel e Next.js.',
    isPublished: true,
    isPremium: false,
    priceCents: 0,
    downloads: 15123,
    tags: ['Deploy', 'Frontend', 'Vercel'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Cloudflare / Edge SDK',
    slug: 'cloudflare-edge-sdk',
    description: 'Gerencie Workers, Durable Objects e KV na edge do Cloudflare de forma inteligente.',
    isPublished: true,
    isPremium: true,
    priceCents: 2900,
    downloads: 11345,
    tags: ['Edge', 'DevOps', 'Cloudflare'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Hugging Face / Vision Trainer',
    slug: 'huggingface-vision-trainer',
    description: 'Treine modelos de visão computacional na infraestrutura do Hugging Face.',
    isPublished: true,
    isPremium: true,
    priceCents: 9900,
    downloads: 14210,
    tags: ['IA', 'Machine Learning'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Google / Gemini API Dev',
    slug: 'google-gemini-api',
    description: 'Acesse o poder do Google Gemini para processamento multimodal e análise avançada.',
    isPublished: true,
    isPremium: false,
    priceCents: 0,
    downloads: 22100,
    tags: ['IA', 'Google', 'GenAI'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Supabase / Postgres Optimization',
    slug: 'supabase-postgres-optimization',
    description: 'Skill para otimizar queries e configurações de banco de dados no Supabase.',
    isPublished: true,
    isPremium: false,
    priceCents: 0,
    downloads: 18456,
    tags: ['Database', 'Supabase'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Sentry / Fix Issues',
    slug: 'sentry-fix-issues',
    description: 'Automação para revisar e corrigir erros monitorados pelo Sentry com IA.',
    isPublished: true,
    isPremium: true,
    priceCents: 1900,
    downloads: 10567,
    tags: ['Monitoramento', 'DevOps'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Trail of Bits / Security Audit',
    slug: 'trail-of-bits-security',
    description: 'Efetue varreduras de segurança em repositórios para achar vulnerabilidades.',
    isPublished: true,
    isPremium: true,
    priceCents: 15900,
    downloads: 4500,
    tags: ['Segurança', 'Auditoria'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Neon / Postgres Serverless',
    slug: 'neon-postgres',
    description: 'Configure branches de banco de dados instantâneos no Neon Postgres.',
    isPublished: true,
    isPremium: false,
    priceCents: 0,
    downloads: 6780,
    tags: ['Database', 'Serverless'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Remotion / Video Gen',
    slug: 'remotion-video',
    description: 'Gere vídeos programaticamente baseados em templates React.',
    isPublished: true,
    isPremium: true,
    priceCents: 4500,
    downloads: 8900,
    tags: ['Vídeo', 'React'],
    nodes: [],
    edges: [],
  },
  {
    title: 'Typefully / Social Poster',
    slug: 'typefully-social',
    description: 'Agende e otimize posts para X (Twitter), LinkedIn e Bluesky usando IA.',
    isPublished: true,
    isPremium: false,
    priceCents: 0,
    downloads: 19200,
    tags: ['Marketing', 'Social'],
    nodes: [],
    edges: [],
  },
];

async function seed() {
  console.log('🌱 Iniciando seed de workflows com dados reais...');

  try {
    for (const wf of realWorkflows) {
      const userId = uuidv4();

      await db.insert(workflows).values({
        id: uuidv4(),
        userId: userId,
        ...wf,
        nodes: wf.nodes as any,
        edges: wf.edges as any,
      });
      console.log(`✅ Inserido: ${wf.title}`);
    }

    console.log('🎉 Seed completo!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    process.exit(0);
  }
}

seed();
