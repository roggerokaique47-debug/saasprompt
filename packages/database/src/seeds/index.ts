import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import db from '../client';
import { categories } from '../schema/categories';
import { users } from '../schema/users';
import { prompts } from '../schema/prompts';
import { articleCategories, articles } from '../schema/articles';
import { workflowCategories, workflows } from '../schema/workflows';
import { skillCategories, skills } from '../schema/skills';
import { agentCategories, agents } from '../schema/agents';
import { reviews } from '../schema/reviews';
import { creators } from '../schema/creators';
import { sales } from '../schema/sales';
import { downloadHistory } from '../schema/downloads';
import { collections, collectionPrompts } from '../schema/collections';
import { purchases } from '../schema/purchases';
import { payouts } from '../schema/payouts';
import { eq, gt } from 'drizzle-orm';
import { externalWorkflows, loadExternalWorkflowJson } from './workflow-imports';
import { externalSkills, loadExternalSkillContent } from './skill-imports';
import { externalAgents, loadExternalAgentContent } from './agent-imports';

async function seed() {
  console.log('Seeding database...\n');

  // ─── USERS ───────────────────────────────────────────────
  const userData = [
    { email: 'admin@prompthub.com', name: 'Admin', locale: 'pt-BR', plan: 'pro' },
    { email: 'joao@example.com', name: 'João Silva', locale: 'pt-BR', plan: 'pro' },
    { email: 'maria@example.com', name: 'Maria Santos', locale: 'pt-BR', plan: 'free' },
    { email: 'pedro@example.com', name: 'Pedro Costa', locale: 'pt-BR', plan: 'free' },
    { email: 'ana@example.com', name: 'Ana Oliveira', locale: 'pt-BR', plan: 'pro' },
    { email: 'lucas@example.com', name: 'Lucas Pereira', locale: 'en-US', plan: 'free' },
    { email: 'julia@example.com', name: 'Julia Almeida', locale: 'pt-BR', plan: 'free' },
    { email: 'carlos@example.com', name: 'Carlos Eduardo', locale: 'en-GB', plan: 'free' },
  ];

  const insertedUsers = [];
  for (const u of userData) {
    const [user] = await db.insert(users).values(u).onConflictDoNothing().returning();
    if (user) insertedUsers.push(user);
  }
  console.log(`  ${insertedUsers.length} usuários criados`);

  const [admin] = await db.select().from(users).where(eq(users.email, 'admin@prompthub.com')).limit(1);
  const [joao] = await db.select().from(users).where(eq(users.email, 'joao@example.com')).limit(1);
  const [maria] = await db.select().from(users).where(eq(users.email, 'maria@example.com')).limit(1);
  const [pedro] = await db.select().from(users).where(eq(users.email, 'pedro@example.com')).limit(1);
  const [ana] = await db.select().from(users).where(eq(users.email, 'ana@example.com')).limit(1);

  // ─── CREATORS ────────────────────────────────────────────
  const creatorData = [
    { userId: joao!.id, bio: 'Criador de conteúdo de IA há 5 anos.', totalEarnings: 1250000 },
    { userId: ana!.id, bio: 'Especialista em automações n8n e prompts de marketing.', totalEarnings: 890000 },
    { userId: pedro!.id, bio: 'Desenvolvedor full-stack, compartilho prompts de programação.', totalEarnings: 340000 },
  ];

  for (const c of creatorData) {
    await db.insert(creators).values(c).onConflictDoNothing();
  }
  console.log(`  ${creatorData.length} creators vinculados`);

  // ─── CATEGORIES ──────────────────────────────────────────
  const catData = [
    { name: 'Marketing Digital', slug: 'marketing-digital', icon: '📢', description: 'Prompts para campanhas, SEO, anúncios e vendas' },
    { name: 'Programação', slug: 'programacao', icon: '💻', description: 'Prompts para código, debugging, arquitetura de software' },
    { name: 'Design & UX', slug: 'design-ux', icon: '🎨', description: 'Prompts para design gráfico, UI/UX, branding' },
    { name: 'Educação', slug: 'educacao', icon: '📚', description: 'Prompts para professores, alunos e conteúdo didático' },
    { name: 'Negócios', slug: 'negocios', icon: '💼', description: 'Prompts para gestão, estratégia e operações' },
    { name: 'Conteúdo Criativo', slug: 'conteudo-criativo', icon: '✍️', description: 'Prompts para blogs, roteiros, storytelling' },
    { name: 'Redes Sociais', slug: 'redes-sociais', icon: '📱', description: 'Prompts para Instagram, TikTok, LinkedIn, YouTube' },
    { name: 'Produtividade', slug: 'produtividade', icon: '⚡', description: 'Prompts para organização, planejamento e automação pessoal' },
    { name: 'Vendas & CRM', slug: 'vendas-crm', icon: '💰', description: 'Prompts para prospecção, pitch, follow-up' },
    { name: 'Saúde & Bem-estar', slug: 'saude-bem-estar', icon: '🧘', description: 'Prompts para saúde mental, exercícios, nutrição' },
  ];

  for (const c of catData) {
    await db.insert(categories).values(c).onConflictDoNothing();
  }

  const cats: Record<string, typeof categories.$inferSelect> = {};
  for (const c of catData) {
    const [row] = await db.select().from(categories).where(eq(categories.slug, c.slug)).limit(1);
    cats[c.slug] = row;
  }
  console.log(`  ${catData.length} categorias criadas`);

  // ─── PROMPTS ─────────────────────────────────────────────
  const promptPool = [
    // Marketing Digital (6)
    { title: 'Gerador de Copy para Anúncios Facebook/Instagram', slug: 'copy-anuncios-facebook', description: 'Crie copies persuasivas para anúncios no Meta Ads com headlines, descrições e CTAs.', content: 'Você é um copywriter sênior especializado em anúncios digitais. Crie 5 variações de anúncio para Facebook/Instagram para o seguinte produto: [produto]. Inclua headline (40 caracteres), descrição primária (125 caracteres), descrição secundária (30 caracteres) e CTA.', model: ['chatgpt', 'claude'], categorySlug: 'marketing-digital', authorId: joao!.id, tags: ['copywriting', 'facebook-ads', 'instagram', 'marketing-digital'], isFeatured: true, downloads: 2340, views: 8900, ratingAvg: '4.8', ratingCount: 120 },
    { title: 'Estratégia de SEO On-Page', slug: 'estrategia-seo-onpage', description: 'Analise e otimize páginas para ranquear melhor no Google.', content: 'Atue como um consultor de SEO sênior. Analise a seguinte URL/página: [url]. Forneça recomendações detalhadas de SEO on-page incluindo: title tag, meta description, headings (H1-H3), densidade de palavras-chave, links internos e otimização de imagens.', model: ['chatgpt'], categorySlug: 'marketing-digital', authorId: joao!.id, tags: ['seo', 'google', 'onpage'], downloads: 1890, views: 7200, ratingAvg: '4.7', ratingCount: 95 },
    { title: 'Pesquisa de Palavras-Chave', slug: 'pesquisa-palavras-chave', description: 'Descubra palavras-chave de alto valor para seu nicho.', content: 'Você é um especialista em SEO. Para o nicho [nicho] e o site [site], gere uma lista de 20 palavras-chave de cauda longa com alto potencial de conversão. Para cada palavra-chave, forneça: volume de busca estimado, intenção de busca (informativa/navegacional/transacional) e sugestão de tipo de conteúdo.\n\nFormato: tabela markdown.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'marketing-digital', authorId: ana!.id, tags: ['seo', 'keyword-research', 'marketing'], isPremium: true, priceCents: 999, downloads: 456, views: 3400, ratingAvg: '4.5', ratingCount: 34 },
    { title: 'Email Marketing Sequência de Nurture', slug: 'email-nurture-sequencia', description: 'Monte uma sequência de 5 emails para nutrir leads.', content: 'Crie uma sequência de 5 emails de nurture marketing para leads que baixaram [lead magnet] sobre o tema [tema]. Objetivo: converter para trial gratuito.\n\nEmail 1 (Dia 0): Entrega do material + próxima dica\nEmail 2 (Dia 2): Case de sucesso\nEmail 3 (Dia 5): Objeções comuns\nEmail 4 (Dia 7): Prova social + depoimentos\nEmail 5 (Dia 10): CTA final com urgência', model: ['chatgpt'], categorySlug: 'marketing-digital', authorId: joao!.id, tags: ['email-marketing', 'nurture', 'conversao'], isPremium: true, priceCents: 499, downloads: 678, views: 4100, ratingAvg: '4.6', ratingCount: 52 },
    { title: 'Briefing para Agência de Marketing', slug: 'briefing-agencia-marketing', description: 'Estruture um briefing completo para contratar agência.', content: 'Crie um template de briefing para contratar uma agência de marketing digital. Inclua seções sobre: histórico da empresa, concorrentes, objetivo de campanha, público-alvo (dados demográficos e psicográficos), orçamento disponível, métricas de sucesso (KPIs), prazos e entregáveis esperados. O formato deve ser profissional e direto.', model: ['chatgpt', 'claude'], categorySlug: 'marketing-digital', authorId: pedro!.id, tags: ['briefing', 'agencia', 'contratacao'], downloads: 1230, views: 5600, ratingAvg: '4.4', ratingCount: 78 },

    // Programação (7)
    { title: 'Code Review Automatizado', slug: 'code-review-automatizado', description: 'Peça uma revisão completa do seu código com sugestões de melhoria.', content: 'Atue como um engenheiro de software sênior especializado em code review. Analise o seguinte código:\n\n```[linguagem]\n[código]\n```\n\nAvalie: (1) Segurança - vulnerabilidades potenciais, (2) Performance - bottlenecks, (3) Legibilidade - complexidade cíclomatica, (4) Manutenibilidade - aderência a SOLID/DRY, (5) Testabilidade. Forneça sugestões acionáveis.\n\nFormato: bullet points com severidade (CRÍTICO, ALTO, MÉDIO, BAIXO).', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'programacao', authorId: pedro!.id, tags: ['code-review', 'qualidade', 'boas-praticas'], isFeatured: true, downloads: 4560, views: 15000, ratingAvg: '4.9', ratingCount: 230 },
    { title: 'Gerador de Testes Unitários', slug: 'gerador-testes-unitarios', description: 'Gere testes unitários completos para suas funções.', content: 'Gere testes unitários abrangentes usando [framework] para a seguinte função:\n\n```[linguagem]\n[código]\n```\n\nInclua: (1) Testes de caminho feliz, (2) Casos de borda, (3) Testes de erro/exceção, (4) Mocks de dependências externas, (5) Testes de integração simples. Use describe/it ou describe/test. Cobertura mínima: 90%.', model: ['chatgpt', 'claude'], categorySlug: 'programacao', authorId: pedro!.id, tags: ['testes', 'unit-test', 'tdd'], isPremium: true, priceCents: 1499, downloads: 2300, views: 9800, ratingAvg: '4.7', ratingCount: 156 },
    { title: 'Refatoração de Código Legado', slug: 'refatoracao-codigo-legado', description: 'Transforme código legado em código moderno e limpo.', content: 'Refatore o código legado abaixo seguindo princípios modernos:\n\n```[linguagem]\n[código]\n```\n\nRequisitos: (1) Extrair funções puras, (2) Remover side effects, (3) Aplicar patterns adequados (Factory, Strategy, Observer), (4) Adicionar type hints/interfaces, (5) Separar concerns. Explique cada mudança.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'programacao', authorId: pedro!.id, tags: ['refatoracao', 'clean-code', 'patterns'], downloads: 1890, views: 7600, ratingAvg: '4.6', ratingCount: 112 },
    { title: 'Arquitetura de Microsserviços', slug: 'arquitetura-microsservicos', description: 'Desenhe uma arquitetura de microsserviços para seu sistema.', content: 'Projete uma arquitetura de microsserviços para um sistema de [descrição do sistema] com os seguintes requisitos:\n\n- 10.000 req/s de pico\n- Disponibilidade 99.99%\n- Dados consistentes eventualmente\n- Deploy em Kubernetes\n\nForneça: (1) Diagrama de serviço, (2) Responsabilidades de cada serviço, (3) Estratégia de comunicação (sync/async), (4) Estratégia de dados (Database per Service), (5) Padrões de resiliência (Circuit Breaker, Retry, Bulkhead), (6) Observabilidade.', model: ['chatgpt', 'claude'], categorySlug: 'programacao', authorId: pedro!.id, tags: ['arquitetura', 'microsservicos', 'kubernetes'], isPremium: true, priceCents: 2499, downloads: 890, views: 4200, ratingAvg: '4.8', ratingCount: 67 },
    { title: 'Debugging: Encontre o Bug', slug: 'debugging-encontre-bug', description: 'Analise um código quebrado e encontre a causa raiz.', content: 'Analise o código abaixo que está produzindo resultados inesperados:\n\n```[linguagem]\n[código]\n```\n\nComportamento esperado: [descrição]\nComportamento atual: [descrição]\n\nEncontre: (1) Causa raiz do bug, (2) Linha exata onde ocorre, (3) Por que acontece, (4) Correção proposta, (5) Teste para prevenir regressão.', model: ['chatgpt'], categorySlug: 'programacao', authorId: pedro!.id, tags: ['debugging', 'bugs', 'analise'], downloads: 3200, views: 11000, ratingAvg: '4.5', ratingCount: 180 },
    { title: 'Explicador de Algoritmos', slug: 'explicador-algoritmos', description: 'Explicação detalhada de algoritmos complexos.', content: 'Explique o algoritmo [nome do algoritmo] como se eu fosse um desenvolvedor júnior. Inclua:\n\n(1) Problema que resolve, (2) Complexidade O(n), (3) Passo a passo visual, (4) Implementação em Python, (5) Exemplo prático, (6) Variações comuns, (7) Onde é usado na indústria.\n\nUse analogias e diagrams em ASCII.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'programacao', authorId: pedro!.id, tags: ['algoritmos', 'educacao', 'programacao'], downloads: 4100, views: 14000, ratingAvg: '4.9', ratingCount: 310 },
    { title: 'Prompt para Gerar API REST Completa', slug: 'gerar-api-rest-completa', description: 'Gere uma API REST completa com CRUD, auth e docs.', content: 'Gere uma API REST completa em [framework/linguagem] para gerenciar [recurso]. Requisitos:\n\n- CRUD completo (Create, Read, Update, Delete)\n- Autenticação JWT\n- Validação de dados\n- Tratamento de erros global\n- Logs estruturados\n- Documentação automática (Swagger/OpenAPI)\n- Testes de integração\n- Dockerfile otimizado\n\nGere: (1) Estrutura de pastas, (2) Model/DTO, (3) Controller, (4) Service, (5) Middleware, (6) Config, (7) Dockerfile, (8) README.', model: ['chatgpt', 'claude'], categorySlug: 'programacao', authorId: pedro!.id, tags: ['api', 'rest', 'crud', 'backend'], isPremium: true, priceCents: 1999, downloads: 670, views: 3800, ratingAvg: '4.7', ratingCount: 45 },

    // Design & UX (5)
    { title: 'Feedback de Design (UI Review)', slug: 'feedback-design-ui-review', description: 'Receba feedback profissional sobre seu design.', content: 'Atue como um designer de produto sênior. Analise o seguinte design:\n\n[Título/descrição do design]\n\nAvalie: (1) Hierarquia visual, (2) Espaçamento e alinhamento, (3) Legibilidade e tipografia, (4) Paleta de cores e contraste, (5) Consistência de componentes, (6) Acessibilidade (WCAG 2.1), (7) Microinterações, (8) Responsividade sugerida.', model: ['chatgpt', 'claude'], categorySlug: 'design-ux', authorId: joao!.id, tags: ['design', 'ui', 'feedback'], downloads: 1560, views: 6200, ratingAvg: '4.6', ratingCount: 88 },
    { title: 'Sistema de Design Tokens', slug: 'sistema-design-tokens', description: 'Crie um sistema completo de design tokens.', content: 'Crie um sistema de design tokens para uma aplicação web/mobile. Inclua:\n\nCores: (1) Primária, secundária, accent, (2) Neutros (50-900), (3) Semânticas (success, warning, error, info)\nTipografia: (4) Font scale (12px-48px), (5) Line heights, (6) Font weights\nEspaçamento: (7) Spacing scale (4px-64px), (8) Grid system (8px base)\nSombras: (9) Elevation tokens\nBreakpoints: (10) Responsivo (sm, md, lg, xl)\n\nFormato: JSON e CSS Custom Properties.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'design-ux', authorId: joao!.id, tags: ['design-system', 'tokens', 'ui'], isPremium: true, priceCents: 799, downloads: 780, views: 4100, ratingAvg: '4.5', ratingCount: 42 },
    { title: 'Briefing de Identidade Visual', slug: 'briefing-identidade-visual', description: 'Estruture o briefing para criação de marca.', content: 'Crie um briefing completo para um projeto de identidade visual. A empresa [nome] atua no ramo de [setor]. Público-alvo: [público]. Diferenciais: [diferenciais].\n\nSeções: (1) Contexto da empresa, (2) Concorrência direta/indireta, (3) Referências visuais, (4) Personalidade da marca, (5) Aplicações necessárias (papelaria, digital, sinalização), (6) Restrições (cores institucionais existentes), (7) Cronograma sugerido, (8) Orçamento estimado.', model: ['chatgpt', 'claude'], categorySlug: 'design-ux', authorId: ana!.id, tags: ['branding', 'identidade-visual', 'design'], downloads: 2100, views: 8300, ratingAvg: '4.7', ratingCount: 134 },
    { title: 'Padrões de Microinterações', slug: 'padroes-microinteracoes', description: 'Catálogo de microinterações para melhorar UX.', content: 'Crie um catálogo de microinterações com código CSS/JS para:\n\n(1) Botão de like com animação, (2) Loading skeleton, (3) Transição de página, (4) Accordion suave, (5) Tooltip com delay, (6) Swipe em mobile, (7) Pull-to-refresh, (8) Scroll reveal, (9) Validação de formulário inline, (10) Notificação toast.\n\nPara cada: descrição do comportamento, gatilho, feedback, código funcional.', model: ['chatgpt', 'claude'], categorySlug: 'design-ux', authorId: ana!.id, tags: ['microinteracoes', 'ux', 'animacao'], isPremium: true, priceCents: 1299, downloads: 450, views: 2900, ratingAvg: '4.8', ratingCount: 38 },
    { title: 'Checklist de Acessibilidade Digital', slug: 'checklist-acessibilidade-digital', description: 'Checklist completo WCAG 2.1 para seu projeto.', content: 'Crie um checklist de acessibilidade digital baseado nas diretrizes WCAG 2.1 nível AA.\n\nCategorias:\n(1) Perceptível: texto alternativo, legendas, contraste de cores, redimensionamento de texto\n(2) Operável: navegação por teclado, tempo ajustável, foco visível, gestos de ponteiro\n(3) Compreensível: idioma definido, navegação consistente, identificação de erros, prevenção de erros\n(4) Robusto: HTML semântico, ARIA labels, responsividade em leitores de tela\n\nFormato: checklist com checkbox, severidade e referência WCAG.', model: ['chatgpt'], categorySlug: 'design-ux', authorId: joao!.id, tags: ['acessibilidade', 'wcag', 'ux'], downloads: 3400, views: 11000, ratingAvg: '4.9', ratingCount: 270 },

    // Educação (5)
    { title: 'Plano de Aula Personalizado', slug: 'plano-aula-personalizado', description: 'Crie um plano de aula completo sobre qualquer tema.', content: 'Crie um plano de aula detalhado para o tema [tema] para alunos de [nível/nível]. Duração: [tempo].\n\nInclua: (1) Objetivos de aprendizagem (conhecimento, habilidade, atitude), (2) Pré-requisitos, (3) Materiais necessários, (4) Roteiro minuto a minuto, (5) Estratégias de engajamento, (6) Atividades práticas, (7) Métodos de avaliação formativa, (8) Lição de casa opcional, (9) Leituras complementares.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'educacao', authorId: maria!.id, tags: ['educacao', 'plano-aula', 'docencia'], isFeatured: true, downloads: 5200, views: 18000, ratingAvg: '4.8', ratingCount: 340 },
    { title: 'Gerador de Questões de Vestibular', slug: 'gerador-questoes-vestibular', description: 'Gere questões de múltipla escolha com gabarito comentado.', content: 'Gere 10 questões de múltipla escolha sobre [tema] no estilo [ENEM/vestibular]. Cada questão deve ter:\n\n(1) Enunciado claro, (2) 5 alternativas (A-E), (3) Apenas uma correta, (4) Comentário explicativo para cada alternativa, (5) Competência/habilidade cobrada, (6) Nível de dificuldade (fácil/médio/difícil).\n\nDistribuição: 3 fáceis, 5 médias, 2 difíceis.', model: ['chatgpt', 'claude'], categorySlug: 'educacao', authorId: maria!.id, tags: ['questoes', 'vestibular', 'avaliacao'], downloads: 2800, views: 9200, ratingAvg: '4.6', ratingCount: 190 },
    { title: 'Resumo de Artigo Científico', slug: 'resumo-artigo-cientifico', description: 'Extraia os principais pontos de qualquer artigo acadêmico.', content: 'Resuma o seguinte artigo científico de forma estruturada:\n\n[cole o abstract/texto]\n\nFormato:\n(1) Problema de pesquisa, (2) Lacuna na literatura, (3) Metodologia, (4) Principais resultados, (5) Limitações do estudo, (6) Contribuições teóricas, (7) Implicações práticas, (8) Agenda de pesquisa futura.\n\nNível de detalhe: médio. Idioma: português. Tamanho: 500-800 palavras.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'educacao', authorId: maria!.id, tags: ['academico', 'resumo', 'pesquisa'], downloads: 4100, views: 13500, ratingAvg: '4.7', ratingCount: 280 },
    { title: 'Roteiro de Estudos Personalizado', slug: 'roteiro-estudos-personalizado', description: 'Monte um cronograma de estudos sob medida.', content: 'Crie um roteiro de estudos personalizado para aprender [habilidade/tema] em [prazo].\n\nPerfil do aluno: [nível de conhecimento], disponibilidade de [X] horas/dia, [Y] dias/semana.\n\nInclua: (1) Metas semanais mensuráveis, (2) Tópicos em ordem de dependência, (3) Recursos recomendados (cursos, livros, artigos), (4) Projetos práticos por módulo, (5) Revisões espaçadas (Spaced Repetition), (6) Marcos de verificação (milestones), (7) Estratégias de recuperação se ficar para trás.', model: ['chatgpt'], categorySlug: 'educacao', authorId: maria!.id, tags: ['estudos', 'cronograma', 'aprendizado'], downloads: 6500, views: 21000, ratingAvg: '4.9', ratingCount: 410 },
    { title: 'Material Didático Interativo', slug: 'material-didatico-interativo', description: 'Transforme conteúdo chato em material interativo.', content: 'Transforme o seguinte conteúdo em material didático interativo:\n\n[conteúdo]\n\nPara cada tópico, crie: (1) Mini-lecture (2 min leitura), (2) Analogia do mundo real, (3) Pergunta reflexiva, (4) Exercício prático, (5) Gamificação (pontos/níveis/badges), (6) Quiz rápido de verificação, (7) Infográfico textual.', model: ['chatgpt', 'claude'], categorySlug: 'educacao', authorId: maria!.id, tags: ['material-didatico', 'interativo', 'gamificacao'], isPremium: true, priceCents: 699, downloads: 560, views: 3100, ratingAvg: '4.5', ratingCount: 33 },

    // Negócios (5)
    { title: 'Plano de Negócios Estruturado', slug: 'plano-negocios-estruturado', description: 'Crie um plano de negócios completo para sua startup.', content: 'Crie um plano de negócios para a empresa [nome] do setor [setor].\n\nSeções:\n(1) Sumário executivo, (2) Análise de mercado (TAM/SAM/SOM), (3) Personas de cliente, (4) Proposta de valor (Canvas), (5) Competidores e vantagem competitiva, (6) Modelo de receita e pricing, (7) Estrutura de custos, (8) Projeção financeira 3 anos (DRE, fluxo de caixa), (9) Marcos e milestones, (10) Equipe e governance.', model: ['chatgpt', 'claude'], categorySlug: 'negocios', authorId: joao!.id, tags: ['plano-negocios', 'startup', 'estrategia'], downloads: 3800, views: 14000, ratingAvg: '4.7', ratingCount: 250 },
    { title: 'Análise SWOT + Plano de Ação', slug: 'analise-swot-plano-acao', description: 'Análise SWOT estratégica com ações concretas.', content: 'Realize uma análise SWOT completa para [empresa/produto] e derive um plano de ação.\n\n(1) Strengths: forças internas, (2) Weaknesses: fraquezas internas, (3) Opportunities: oportunidades externas, (4) Threats: ameaças externas.\n\nMatriz cruzada: S+O (estratégias de crescimento), W+O (estratégias de melhoria), S+T (estratégias defensivas), W+T (estratégias de mitigação).\n\nPara cada estratégia: ação concreta, responsável sugerido, prazo, KPI.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'negocios', authorId: joao!.id, tags: ['swot', 'analise', 'estrategia'], downloads: 2900, views: 10500, ratingAvg: '4.6', ratingCount: 175 },
    { title: 'Pitch Deck Investor Ready', slug: 'pitch-deck-investor-ready', description: 'Estruture um pitch deck para investidores anjo.', content: 'Crie o conteúdo completo para um pitch deck de 10 slides para a startup [nome].\n\nSlide 1: Título + tagline impactante\nSlide 2: Problema (dados, histórico, dor real)\nSlide 3: Solução (produto + demo textual)\nSlide 4: Tamanho de mercado (TAM/SAM/SOM)\nSlide 5: Business model (como ganha dinheiro)\nSlide 6: Traction (métricas, crescimento, clientes)\nSlide 7: Concorrência (matriz 2x2 ou comparação)\nSlide 8: Time (fundadores, advisors)\nSlide 9: Financials (projeção 3 anos)\nSlide 10: Ask (quanto, para quê, milestones)', model: ['chatgpt', 'claude'], categorySlug: 'negocios', authorId: joao!.id, tags: ['pitch-deck', 'investimento', 'startup'], isPremium: true, priceCents: 1999, downloads: 340, views: 2100, ratingAvg: '4.8', ratingCount: 29 },
    { title: 'Template de OKRs', slug: 'template-okrs', description: 'Crie OKRs alinhados com a estratégia da empresa.', content: 'Crie OKRs (Objectives and Key Results) para [empresa] no [trimestre/ano].\n\nObjective 1: [tema]\n  KR1: métrica mensurável de [baseline] para [target]\n  KR2: métrica mensurável de [baseline] para [target]\n  KR3: métrica mensurável de [baseline] para [target]\n\nForneça 3 Objectives com 3 KRs cada. Inclua: (1) Nível empresa, (2) Nível time/departamento, (3) Nível individual. Adicione health metrics para balancear.', model: ['chatgpt'], categorySlug: 'negocios', authorId: joao!.id, tags: ['okr', 'metas', 'gestao'], downloads: 5100, views: 16000, ratingAvg: '4.5', ratingCount: 300 },
    { title: 'Análise de Concorrência', slug: 'analise-concorrencia', description: 'Mapa competitivo detalhado do seu mercado.', content: 'Realize uma análise de concorrência para [empresa] no mercado de [setor].\n\nIdentifique 5 concorrentes (diretos e indiretos) e compare:\n(1) Posicionamento de marca, (2) Precificação, (3) Público-alvo, (4) Canais de distribuição, (5) Diferenciais, (6) Fraquezas exploráveis, (7) Market share estimado.\n\nEntregue: (a) Matriz de posicionamento perceptual, (b) Tabela comparativa, (c) Blue Ocean Canvas sugerindo diferenciação.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'negocios', authorId: pedro!.id, tags: ['concorrencia', 'mercado', 'analise'], downloads: 1800, views: 6800, ratingAvg: '4.4', ratingCount: 95 },

    // Conteúdo Criativo (6)
    { title: 'Storytelling: Estrutura de Narrativa', slug: 'storytelling-estrutura-narrativa', description: 'Crie uma narrativa envolvente usando a Jornada do Herói.', content: 'Crie uma narrativa completa usando a Jornada do Herói (12 etapas de Campbell) para:\n\nTema: [tema]\nPersonagem principal: [personagem]\nContexto: [contexto]\n\nEtapas: (1) Mundo comum, (2) Chamado à aventura, (3) Recusa do chamado, (4) Encontro com mentor, (5) Travessia do limiar, (6) Provas, aliados e inimigos, (7) Aproximação caverna profunda, (8) Provação suprema, (9) Recompensa, (10) Caminho de volta, (11) Ressurreição, (12) Retorno com elixir.', model: ['chatgpt', 'claude'], categorySlug: 'conteudo-criativo', authorId: ana!.id, tags: ['storytelling', 'narrativa', 'criacao'], isFeatured: true, downloads: 6700, views: 22000, ratingAvg: '4.9', ratingCount: 380 },
    { title: 'Gerador de Roteiros para Vídeo', slug: 'gerador-roteiros-video', description: 'Roteiros prontos para YouTube, TikTok e Reels.', content: 'Crie um roteiro de vídeo para [plataforma] sobre [tema] com duração de [tempo].\n\nEstrutura:\n(1) Hook (primeiros 3-5 segundos) - prender atenção\n(2) Problema - identificação com a audiência\n(3) Solução/Conteúdo - valor entregue\n(4) Call to Action - engajamento\n\nEstilo: [educativo/entretenimento/polêmico/inspirador].\nTom: [formal/casual/irreverente].\nInclua direções de cena e expressões.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'conteudo-criativo', authorId: ana!.id, tags: ['roteiro', 'video', 'youtube', 'tiktok'], isPremium: true, priceCents: 599, downloads: 890, views: 4500, ratingAvg: '4.6', ratingCount: 55 },
    { title: 'Ideias para Calendário Editorial', slug: 'ideias-calendario-editorial', description: '30 ideias de conteúdo para 30 dias.', content: 'Crie 30 ideias de conteúdo para o nicho [nicho] para alimentar um calendário editorial de 30 dias.\n\nDistribuição:\n- 10 posts educativos\n- 8 posts de entretenimento\n- 5 posts de prova social/casos\n- 4 posts de produto/venda\n- 3 posts interativos (enquetes, quizzes)\n\nPara cada: título chamativo, formato (carrossel/vídeo/texto), legenda curta, hashtags (5), melhor horário para postar.', model: ['chatgpt'], categorySlug: 'conteudo-criativo', authorId: ana!.id, tags: ['conteudo', 'editorial', 'planejamento'], downloads: 4900, views: 17000, ratingAvg: '4.7', ratingCount: 310 },
    { title: 'Copy para Landing Page', slug: 'copy-landing-page', description: 'Copy persuasiva para landing page de alto impacto.', content: 'Escreva o copy completo para uma landing page de [produto/serviço] targeting [público-alvo].\n\nSeções:\n(1) Hero section: headline + subheadline + CTA\n(2) Social proof: logos, depoimentos, números\n(3) Dores: reconhecimento do problema\n(4) Solução: como resolve\n(5) Features: o que inclui (bullet points)\n(6) Como funciona: 3 passos simples\n(7) Garantia: redução de risco\n(8) FAQ: objeções frequentes\n(9) CTA final: oferta + urgência', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'conteudo-criativo', authorId: ana!.id, tags: ['landing-page', 'copywriting', 'conversao'], downloads: 3600, views: 12000, ratingAvg: '4.8', ratingCount: 260 },
    { title: 'Títulos Chamativos (Clickbait Ético)', slug: 'titulos-chamativos-clickbait', description: '20 títulos que geram curiosidade e cliques.', content: 'Gere 20 títulos chamativos para [conteúdo] seguindo a fórmula "Gatilho + Promessa + Especificidade".\n\n5 fórmulas diferentes (4 títulos cada):\n(1) "Como [resultado] sem [dor]" \n(2) "[Número] [tema] que [benefício]" \n(3) "O segredo de [especialista] para [resultado]" \n(4) "[X] anos de [experiência] em [X] minutos" \n(5) "Pare de [erro] e comece a [resultado]"', model: ['chatgpt'], categorySlug: 'conteudo-criativo', authorId: joao!.id, tags: ['titulos', 'copywriting', 'conteudo'], downloads: 4400, views: 15000, ratingAvg: '4.5', ratingCount: 210 },
    { title: 'Descrição de Produto Persuasiva', slug: 'descricao-produto-persuasiva', description: 'Descrições de produto que vendem sem ser apelativas.', content: 'Escreva a descrição de produto para [produto] na plataforma [Shopify/Amazon/Marketplace].\n\nFormato AIDA:\n- Attention: headline que para o scroll\n- Interest: storytelling sobre o produto\n- Desire: benefícios (não features)\n- Action: CTA com gatilho de escassez\n\nInclua: (1) 5 bullet points de benefícios, (2) Especificações técnicas, (3) Prova social (avaliações fictícias), (4) FAQ, (5) SEO title + meta description.', model: ['chatgpt', 'claude'], categorySlug: 'conteudo-criativo', authorId: ana!.id, tags: ['produto', 'descricao', 'ecommerce'], isPremium: true, priceCents: 399, downloads: 1200, views: 5800, ratingAvg: '4.4', ratingCount: 78 },

    // Redes Sociais (5)
    { title: 'Estratégia de LinkedIn B2B', slug: 'estrategia-linkedin-b2b', description: 'Construa autoridade e gere leads no LinkedIn.', content: 'Crie uma estratégia de 30 dias para LinkedIn B2B para [perfil/empresa].\n\nConteúdo semanal:\nSegunda: storytelling profissional\nTerça: dica rápida (carrossel)\nQuarta: opinião sobre tendência\nQuinta: case de sucesso/cliente\nSexta: bastidores/trabalho\nSábado: curadoria de conteúdo\nDomingo: off/weekend vibe\n\nInclua: estratégia de conexões (50/dia), commenting strategy, DMs de follow-up.', model: ['chatgpt', 'claude'], categorySlug: 'redes-sociais', authorId: ana!.id, tags: ['linkedin', 'b2b', 'autoridade'], isFeatured: true, downloads: 5400, views: 19000, ratingAvg: '4.8', ratingCount: 290 },
    { title: 'Calendário de Posts para Instagram', slug: 'calendario-posts-instagram', description: '1 mês de conteúdo pronto para Instagram.', content: 'Crie um calendário de 30 posts para Instagram de [perfil/marca] no nicho [nicho].\n\nMix de conteúdo:\n- Feed: 10 posts estáticos, 5 carrosséis\n- Stories: 10 ideias interativas (enquetes, caixinha, quiz)\n- Reels: 5 ideias de vídeo viral\n\nPara cada: (1) Briefing criativo, (2) Copy da legenda com CTA, (3) Hashtags (10-15), (4) Melhor horário, (5) Formato de mídia sugerido.', model: ['chatgpt'], categorySlug: 'redes-sociais', authorId: ana!.id, tags: ['instagram', 'calendario', 'conteudo'], downloads: 6300, views: 20000, ratingAvg: '4.7', ratingCount: 350 },
    { title: 'Responder Comentários com Personalidade', slug: 'responder-comentarios-personalidade', description: 'Respostas prontas para engajar sua audiência.', content: 'Crie um guia de respostas para comentários em redes sociais para [marca/pessoa] com tom [formal/casual/humorado].\n\nCategorias:\n(1) Elogios: 10 variações de agradecimento\n(2) Perguntas frequentes: 15 respostas completas\n(3) Críticas construtivas: 5 respostas elegantes\n(4) Trolls/negatividade: 5 respostas desarmantes\n(5) Engajamento: 10 perguntas para continuar conversa\n(6) Vendas: 5 respostas com CTAs suaves', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'redes-sociais', authorId: ana!.id, tags: ['engajamento', 'comentarios', 'social-media'], isPremium: true, priceCents: 299, downloads: 3400, views: 13000, ratingAvg: '4.6', ratingCount: 200 },
    { title: 'Estratégia TikTok para Alcance Orgânico', slug: 'estrategia-tiktok-alcance-organico', description: 'Cresça no TikTok sem gastar com anúncios.', content: 'Crie uma estratégia orgânica de 60 dias para TikTok para [perfil/marca].\n\nFoco em: (1) Nicho clusters - 3 pilares de conteúdo, (2) Tendências semanais - como adaptar, (3) Formatos virais - dueto, stitch, POV, (4) Hashtag strategy - tamanho de pool por vídeo, (5) Melhores horários por GMT, (6) Frequência ideal (1-3x/dia), (7) Analytics - quais métricas importam, (8) Colabs com creators do nicho.', model: ['chatgpt', 'claude'], categorySlug: 'redes-sociais', authorId: ana!.id, tags: ['tiktok', 'organico', 'estrategia'], downloads: 2100, views: 8700, ratingAvg: '4.5', ratingCount: 130 },
    { title: 'Script para Vídeo Curto (Reels/Shorts)', slug: 'script-video-curto-reels', description: 'Scripts otimizados para o algoritmo de vídeos curtos.', content: 'Crie 5 scripts para vídeos curtos (Reels/Shorts/TikTok) sobre [tema].\n\nCada script:\n- Duração: 15-30 segundos\n- Hook (0-3s): primeira impressão\n- Desenvolvimento (3-15s): conteúdo principal\n- CTA (15-30s): ação desejada\n- Texto na tela: pontos-chave\n- Legendas: otimizadas para busca\n\nInclua dicas de edição (cortes, efeitos, música).', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'redes-sociais', authorId: pedro!.id, tags: ['reels', 'shorts', 'video-curto'], downloads: 3900, views: 14000, ratingAvg: '4.7', ratingCount: 240 },

    // Produtividade (5)
    { title: 'Sistema GTD Personalizado', slug: 'sistema-gtd-personalizado', description: 'Implemente o Getting Things Done do seu jeito.', content: 'Crie um sistema GTD (Getting Things Done) adaptado para [profissão/perfil].\n\nEtapas:\n(1) Capture: ferramentas de captura (apps, papel, voz)\n(2) Clarify: processamento diário - o que é acionável\n(3) Organize: pastas (next actions, waiting, someday/maybe, reference)\n(4) Reflect: revisão semanal passo a passo\n(5) Engage: como escolher o que fazer agora (matriz de prioridade)\n\nInclua templates de listas e rotina diária/semanal.', model: ['chatgpt', 'claude'], categorySlug: 'produtividade', authorId: joao!.id, tags: ['gtd', 'produtividade', 'organizacao'], downloads: 4500, views: 16000, ratingAvg: '4.8', ratingCount: 330 },
    { title: 'Template de Reunião Eficaz', slug: 'template-reuniao-eficaz', description: 'Nunca mais perca tempo em reuniões improdutivas.', content: 'Crie templates para 4 tipos de reunião:\n\n(1) Daily (15min): o que fez, o que vai fazer, blockers\n(2) Weekly (60min): wins, lessons, priorities, metrics\n(3) Planning/Sprint (2h): objetivos, backlog grooming, estimativas\n(4) One-on-one (30min): feedback, career, well-being\n\nCada template: agenda pré-preenchida, timebox por item, output esperado, DACI (driver, approver, contributor, informed).', model: ['chatgpt', 'claude'], categorySlug: 'produtividade', authorId: joao!.id, tags: ['reuniao', 'template', 'agil'], isPremium: true, priceCents: 499, downloads: 2900, views: 11000, ratingAvg: '4.6', ratingCount: 180 },
    { title: 'Automação de Tarefas Repetitivas', slug: 'automacao-tarefas-repetitivas', description: 'Identifique e automatize tarefas que roubam seu tempo.', content: 'Analise as seguintes tarefas diárias/semanais e sugira automações:\n\nLista de tarefas:\n[tarefas separadas por linha]\n\nPara cada tarefa:\n(1) Tempo gasto por semana, (2) Complexidade de automatizar (baixa/média/alta), (3) Ferramenta sugerida (Zapier, n8n, Make, script), (4) Passos da automação, (5) ROI estimado em horas/mês.', model: ['chatgpt'], categorySlug: 'produtividade', authorId: pedro!.id, tags: ['automacao', 'produtividade', 'otimizacao'], downloads: 3200, views: 12000, ratingAvg: '4.7', ratingCount: 210 },
    { title: 'Morning Routine de Alta Performance', slug: 'morning-routine-alta-performance', description: 'Rotina matinal baseada em ciência para começar bem.', content: 'Crie uma morning routine personalizada baseada em neurociência para [perfil: night owl/early bird].\n\nDuração total: 60-90 minutos.\n\nBlocos:\n(1) Hidratação + luz natural (ativar sistema circadiano)\n(2) Movimento (10-20 min) - tipo de exercício ideal\n(3) Mindfulness/Meditação (10 min) - técnica guiada\n(4) Aprendizado (15 min) - consumo ativo vs passivo\n(5) Planejamento (10 min) - top 3 prioridades do dia\n(6) Deep work (30 min) - primeira tarefa do dia\n\nDomingo: adaptação para dia de descanso.', model: ['chatgpt', 'claude'], categorySlug: 'produtividade', authorId: joao!.id, tags: ['rotina', 'saude', 'alta-performance'], downloads: 5800, views: 19000, ratingAvg: '4.9', ratingCount: 420 },
    { title: 'Segundo Cérebro (Digital Brain)', slug: 'segundo-cerebro-digital-brain', description: 'Sistema PARA + Zettelkasten para gestão de conhecimento.', content: 'Implemente o método "Segundo Cérebro" (Tiago Forte) + Zettelkasten no [Notion/Obsidian/Anytype].\n\nEstrutura:\n\n📁 P - Projects: ativos com prazo\n📁 A - Areas: responsabilidades contínuas\n📁 R - Resources: temas de interesse\n📁 A - Archives: concluídos/inativos\n\n📝 Zettelkasten dentro de Resources:\n  - Atomic notes (1 ideia/nota)\n  - Links entre notas bidirecionais\n  - Tags de contexto\n\nFluxo: Capture → Organize → Distille → Express.\nTemplate completo de banco de dados.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'produtividade', authorId: joao!.id, tags: ['segundo-cerebro', 'knowledge', 'notion'], isPremium: true, priceCents: 999, downloads: 1200, views: 6500, ratingAvg: '4.8', ratingCount: 95 },

    // Vendas & CRM (3)
    { title: 'Script de Cold Call B2B', slug: 'script-cold-call-b2b', description: 'Script de chamada fria que converte.', content: 'Crie um script de cold call B2B para vender [produto/serviço] para [público-alvo].\n\nEstrutura:\n(1) Abertura (10s): nome, empresa, propósito\n(2) Gancho (20s): insight/dor específica\n(3) Qualificação (30s): perguntas abertas\n(4) Proposta de valor (20s): como resolve\n(5) Objeções comuns: respostas preparadas\n(6) Close: agendamento ou próxima ação\n\nInclua variações para gatekeeper, voicemail e follow-up email.', model: ['chatgpt', 'claude'], categorySlug: 'vendas-crm', authorId: joao!.id, tags: ['cold-call', 'vendas', 'b2b'], downloads: 2700, views: 9800, ratingAvg: '4.6', ratingCount: 160 },
    { title: 'Pipeline de Vendas (CRM Setup)', slug: 'pipeline-vendas-crm-setup', description: 'Configure um pipeline de vendas completo no CRM.', content: 'Crie a configuração ideal de pipeline de vendas para [tipo de negócio] no [CRM: HubSpot/Salesforce/Pipedrive].\n\nEstágios:\n(1) Prospecção, (2) Qualificação BANT, (3) Demo agendada, (4) Demo realizada, (5) Proposta enviada, (6) Negociação, (7) Fechado ganho, (8) Fechado perdido\n\nPara cada estágio: critérios de entrada/saída, ações obrigatórias, campos personalizados, automações (email, task, alerta).\n\nInclua: dashboard de métricas (conversão, tempo médio, ticket médio).', model: ['chatgpt', 'claude'], categorySlug: 'vendas-crm', authorId: joao!.id, tags: ['crm', 'pipeline', 'sales'], downloads: 1600, views: 6300, ratingAvg: '4.5', ratingCount: 90 },
    { title: 'Follow-up Sequence (7 Emails)', slug: 'followup-sequencia-7-emails', description: 'Sequência de follow-up que recupera leads frios.', content: 'Crie uma sequência de 7 emails de follow-up para leads que não responderam após [ação: demo/proposta/download].\n\nDia 1: Valor - conteúdo útil relacionado\nDia 3: Social proof - case de sucesso similar\nDia 5: Pergunta - engajamento suave\nDia 7: Objeção - abordar objeção comum\nDia 10: Proposta - lembrete da oferta\nDia 14: Breaking pattern - abordagem criativa\nDia 21: Last attempt - quebra ou segue\n\nCada email: assunto, corpo (max 100 palavras), CTA único.', model: ['chatgpt'], categorySlug: 'vendas-crm', authorId: joao!.id, tags: ['follow-up', 'email', 'vendas'], isPremium: true, priceCents: 399, downloads: 1900, views: 7800, ratingAvg: '4.7', ratingCount: 140 },

    // Saúde & Bem-estar (3)
    { title: 'Plano Alimentar Personalizado', slug: 'plano-alimentar-personalizado', description: 'Cardápio semanal balanceado para seus objetivos.', content: 'Crie um plano alimentar de 7 dias para alguém com objetivo [perda de peso/ganho muscular/saúde geral], [restrições alimentares], [nível de atividade física].\n\nCada dia:\nCafé da manhã, Lanche manhã, Almoço, Lanche tarde, Jantar, Ceia\n\nInclua: (1) Macro nutrientes por refeição, (2) Opções de substituição, (3) Lista de compras semanal, (4) Preparações do domingo (meal prep), (5) Dicas de hidratação.', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'saude-bem-estar', authorId: maria!.id, tags: ['alimentacao', 'saude', 'nutricao'], downloads: 6100, views: 20000, ratingAvg: '4.7', ratingCount: 360 },
    { title: 'Rotina de Exercícios em Casa', slug: 'rotina-exercicios-em-casa', description: 'Treino completo sem equipamentos para qualquer nível.', content: 'Crie uma rotina de exercícios de 4 semanas para fazer em casa sem equipamentos.\n\nNível: [iniciante/intermediário/avançado]\nFrequência: [3/4/5/6] dias/semana\n\nCada treino: (1) Aquecimento (5min), (2) Circuito principal (20-30min), (3) Cardio final (10min), (4) Alongamento (5min)\n\nInclua: progressão de carga (mais repetições, menos descanso), variações para cada exercício, planilha de acompanhamento semanal.', model: ['chatgpt', 'claude'], categorySlug: 'saude-bem-estar', authorId: maria!.id, tags: ['exercicio', 'casa', 'fitness'], downloads: 4800, views: 16000, ratingAvg: '4.6', ratingCount: 290 },
    { title: 'Guia de Saúde Mental no Trabalho', slug: 'guia-saude-mental-trabalho', description: 'Estratégias para manter a saúde mental no ambiente profissional.', content: 'Crie um guia prático de saúde mental para profissionais que trabalham [remoto/presencial/híbrido].\n\nTópicos:\n(1) Sinais de alerta: quando procurar ajuda\n(2) Técnicas de respiração para ansiedade (4-7-8, box breathing)\n(3) Micro-pausas: pomodoro adaptado para saúde mental\n(4) Estabelecendo limites: como dizer não\n(5) Exercícios de grounding para crises de ansiedade\n(6) Rotina de descompressão pós-trabalho\n(7) Comunicação não-violenta em conflitos\n(8) Recursos: apps, terapeutas online, crises', model: ['chatgpt', 'claude', 'gemini'], categorySlug: 'saude-bem-estar', authorId: maria!.id, tags: ['saude-mental', 'bem-estar', 'trabalho'], isPremium: true, priceCents: 799, downloads: 3200, views: 12000, ratingAvg: '4.9', ratingCount: 230 },
  ];

  for (const { categorySlug, ...p } of promptPool) {
    await db.insert(prompts).values({
      ...p,
      categoryId: cats[categorySlug]?.id,
      model: p.model as [string, ...string[]],
      tags: p.tags as [string, ...string[]],
    }).onConflictDoNothing();
  }
  console.log(`  ${promptPool.length} prompts criados`);

  // ─── REVIEWS ─────────────────────────────────────────────
  const promptsList = await db.select({ id: prompts.id }).from(prompts).limit(50);
  const reviewData = [
    { promptId: promptsList[0]?.id, userId: maria!.id, rating: 5, comment: 'Melhor prompt de copy que já usei! As variações são muito boas.' },
    { promptId: promptsList[0]?.id, userId: pedro!.id, rating: 4, comment: 'Muito bom, só podia ter mais exemplos pra B2B.' },
    { promptId: promptsList[1]?.id, userId: ana!.id, rating: 5, comment: 'SEO nunca foi tão fácil! Recomendo.' },
    { promptId: promptsList[2]?.id, userId: joao!.id, rating: 4, comment: 'Boa pesquisa de palavras, mas podia incluir volume de busca exato.' },
    { promptId: promptsList[3]?.id, userId: maria!.id, rating: 5, comment: 'Email nurture perfeito para nossa campanha.' },
  ];
  for (const r of reviewData) {
    if (r.promptId) await db.insert(reviews).values(r).onConflictDoNothing();
  }
  console.log(`  ${reviewData.length} reviews criadas`);

  // ─── ARTICLE CATEGORIES ─────────────────────────────────
  const acData = [
    { name: 'Tutoriais', slug: 'tutoriais', icon: '📖' },
    { name: 'Guias Rápidos', slug: 'guias-rapidos', icon: '📄' },
    { name: 'Documentação', slug: 'documentacao', icon: '📚' },
    { name: 'Cases & Estudos', slug: 'cases-estudos', icon: '📊' },
  ];
  for (const ac of acData) {
    await db.insert(articleCategories).values(ac).onConflictDoNothing();
  }
  const acMap: Record<string, typeof articleCategories.$inferSelect> = {};
  for (const ac of acData) {
    const [row] = await db.select().from(articleCategories).where(eq(articleCategories.slug, ac.slug)).limit(1);
    if (row) acMap[ac.slug] = row;
  }

  // ─── ARTICLES ────────────────────────────────────────────
  const articleData = [
    {
      title: 'Como criar automações no n8n: Guia completo para iniciantes',
      slug: 'guia-completo-n8n-iniciantes',
      description: 'Aprenda do zero a criar automações poderosas com n8n. Do webhook à integração com APIs.',
      content: `# Como criar automações no n8n: Guia completo para iniciantes\n\nO n8n é uma ferramenta de automação de código aberto que permite conectar serviços e APIs sem precisar escrever código. Neste guia, você vai aprender desde a instalação até automações avançadas.\n\n## O que é n8n?\n\nn8n (nodemation) é uma plataforma de automação workflow-based que conecta serviços como Google Sheets, Gmail, Slack, Telegram, bancos de dados e APIs REST.\n\nDiferenciais:\n- Código aberto (self-hosted ou cloud)\n- 400+ integrações nativas\n- Execução local (dados não saem do seu servidor)\n- Interface visual intuitiva\n- Código JavaScript customizado nos workflows\n\n## Instalação com Docker\n\nA forma mais simples de começar:\n\n\`\`\`bash\ndocker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n\n\`\`\`\n\nAcesse http://localhost:5678 e crie sua conta.\n\n## Seu primeiro workflow: Webhook → Email\n\n### Passo 1: Adicionar nó Webhook\nArraste um nó Webhook para a tela. Configure:\n- HTTP Method: POST\n- Path: /lead\n- Response: "Lead recebido com sucesso!"\n\n### Passo 2: Conectar nó Email\nAdicione um nó Email (SMTP). Configure com seu provedor:\n- Host: smtp.gmail.com\n- Port: 587\n- User: seu@email.com\n- Password: app password\n\n### Passo 3: Mapear dados\nNo nó Email, use as variáveis do Webhook:\n- To: seu@email.com\n- Subject: ={{$json.subject}}\n- Text: =Novo lead: {{$json.name}} - {{$json.email}}\n\n### Passo 4: Ativar workflow\nClique em "Active" no canto superior direito. Pronto! Qualquer POST para seu webhook dispara o email.\n\n## Conectando com APIs externas\n\nO n8n se destaca na integração com APIs. Exemplo com a API do Telegram:\n\`\`\`javascript\n// Nó HTTP Request\nconst response = await $http.send('GET', 'https://api.telegram.org/bot{{$credentials.telegram.token}}/getUpdates');\nreturn response.data;\n\`\`\`\n\n## Boas práticas\n\n1. **Error handling**: sempre adicione nós "Error Trigger" para capturar falhas\n2. **Logging**: use nós "Set" para salvar payloads intermediários\n3. **Rate limiting**: respeite limites de APIs com nós "Wait"\n4. **Segurança**: nunca hardcode credenciais; use o credential store do n8n\n5. **Testes**: use o botão "Execute Node" para testar cada nó isoladamente\n\n## Conclusão\n\nO n8n é uma ferramenta poderosa que democratiza automações. Comece com workflows simples e vá aumentando a complexidade gradualmente.`,
      categorySlug: 'tutoriais', authorId: admin!.id, contentType: 'tutorial', isPublished: true,
      tags: ['n8n', 'automacao', 'tutorial', 'iniciante'], readTimeMinutes: 8, views: 3400,
    },
    {
      title: '10 Prompts de ChatGPT que vão transformar seu marketing',
      slug: '10-prompts-chatgpt-marketing',
      description: 'Os melhores prompts de marketing para ChatGPT testados e aprovados.',
      content: `# 10 Prompts de ChatGPT que vão transformar seu marketing\n\nCompilei os 10 prompts mais eficazes para marketing digital baseados em testes com mais de 500 profissionais.\n\n## 1. Análise de Concorrência\n\n> "Atue como um analista de mercado. Analise os 3 principais concorrentes de [empresa] no setor de [setor]. Para cada um, identifique: posicionamento, diferenciais, fraquezas e estratégia de pricing. Entregue em formato de tabela comparativa."\n\n## 2. SEO Content Cluster\n\n> "Crie um content cluster para a palavra-chave [palavra-chave]. Inclua 1 pillar page (2000+ palavras) e 8 cluster articles (1000+ palavras cada). Para cada artigo: title tag, meta description, headings (H1-H3), palavras-chave relacionadas e internal links."\n\n## 3. Copy de Anúncio\n\n> [prompt completo de copy]\n\n## 4. Persona de Cliente\n\n> [prompt de persona]\n\n## 5. Calendário Editorial\n\n> [prompt de calendário]\n\n## Dicas de uso\n\n1. **Seja específico**: quanto mais contexto, melhor o resultado\n2. **Use exemplos**: mostre o formato que você quer\n3. **Itere**: peça refinamentos, não aceite a primeira versão\n4. **Templates**: crie seus próprios templates de prompt no ChatGPT`,
      categorySlug: 'guias-rapidos', authorId: joao!.id, contentType: 'guia', isPublished: true,
      tags: ['chatgpt', 'prompts', 'marketing', 'dicas'], readTimeMinutes: 6, views: 5200,
    },
    {
      title: 'Configurando Stripe com Next.js 15: Passo a passo',
      slug: 'stripe-nextjs-15-integracao',
      description: 'Integração completa de pagamentos com Stripe no Next.js 15 App Router.',
      content: `# Configurando Stripe com Next.js 15: Passo a passo\n\nNeste tutorial, vou mostrar como integrar Stripe Checkout em uma aplicação Next.js 15 App Router, incluindo webhooks e gerenciamento de assinaturas.\n\n## Pré-requisitos\n\n- Next.js 15\n- Conta Stripe\n- Variáveis de ambiente configuradas\n\n## 1. Instalação\n\n\`\`\`bash\nnpm install @stripe/stripe-js @stripe/react-stripe-js stripe\n\`\`\`\n\n## 2. Server Action para Checkout\n\n\`\`\`typescript\n'use server';\n\nimport Stripe from 'stripe';\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);\n\nexport async function createCheckoutSession(priceId: string) {\n  const session = await stripe.checkout.sessions.create({\n    mode: 'payment',\n    line_items: [{ price: priceId, quantity: 1 }],\n    success_url: \`\${process.env.NEXT_PUBLIC_URL}/success\`,\n    cancel_url: \`\${process.env.NEXT_PUBLIC_URL}/cancel\`,\n  });\n\n  return { url: session.url };\n}\n\`\`\`\n\n## 3. Webhook Handler\n\n\`\`\`typescript\nexport async function POST(req: Request) {\n  const body = await req.text();\n  const sig = req.headers.get('stripe-signature')!;\n\n  const event = stripe.webhooks.constructEvent(\n    body,\n    sig,\n    process.env.STRIPE_WEBHOOK_SECRET!\n  );\n\n  switch (event.type) {\n    case 'checkout.session.completed':\n      // Liberar conteúdo premium\n      break;\n    case 'customer.subscription.updated':\n      // Atualizar plano do usuário\n      break;\n  }\n\n  return Response.json({ received: true });\n}\n\`\`\`\n\n## Conclusão\n\nA integração com Stripe no Next.js 15 é direta usando Server Actions e Route Handlers. O segredo está em tratar os webhooks corretamente para manter o estado sincronizado.`,
      categorySlug: 'tutoriais', authorId: admin!.id, contentType: 'tutorial', isPublished: true,
      tags: ['stripe', 'nextjs', 'pagamentos', 'integracao'], readTimeMinutes: 10, views: 2100,
    },
    {
      title: 'Drizzle ORM vs Prisma: Qual escolher em 2026?',
      slug: 'drizzle-vs-prisma-2026',
      description: 'Comparativo detalhado entre os dois ORMs mais populares do ecossistema TypeScript.',
      content: `# Drizzle ORM vs Prisma: Qual escolher em 2026?\n\nAmbos são ORMs excelentes, mas têm filosofias diferentes. Vou comparar baseado em experiência de produção com ambos.\n\n## Performance\n\nDrizzle ganha por ser thin layer sobre SQL. Prisma tem overhead do engine Rust.\n\n\`\`\`sql\n-- Drizzle: gera SQL puro\nSELECT id, name FROM users WHERE email = $1\n\`\`\`\n\nPrisma adiciona camadas de serialização/desserialização.\n\n## Type Safety\n\nAmbos têm type safety excelente. Diferenças sutis:\n\n**Drizzle**: types inferidos do schema SQL\n**Prisma**: types gerados do schema.prisma\n\n## Bundle Size\n\nDrizzle: ~3KB gzip\nPrisma: ~12MB (inclui engine)\n\n## Curva de Aprendizado\n\nPrisma: mais fácil para iniciantes (schema declarativo)\nDrizzle: exige conhecimento de SQL\n\n## Conclusão\n\nEscolha Drizzle se: performance importa, você sabe SQL, quer bundle pequeno\nEscolha Prisma se: time é júnior, prefere schema declarativo, precisa de migrations automatizadas`,
      categorySlug: 'documentacao', authorId: pedro!.id, contentType: 'documentacao', isPublished: true,
      tags: ['drizzle', 'prisma', 'orm', 'typescript', 'comparativo'], readTimeMinutes: 7, views: 1800,
    },
    {
      title: 'Como fizemos R$ 50k em vendas com automação no n8n',
      slug: 'case-vendas-automacao-n8n',
      description: 'Case real de como automatizamos o processo de vendas e aumentamos o faturamento em 300%.',
      content: `# Como fizemos R$ 50k em vendas com automação no n8n\n\nEste é um case real de como usamos n8n para automatizar nosso funil de vendas B2B.\n\n## O Problema\n\nNosso time de vendas gastava 70% do tempo em tarefas manuais:\n-Qualificação manual de leads\n- Envio individual de propostas\n- Follow-up esquecido\n- Relatórios manuais\n\n## A Solução\n\nCriamos um workflow no n8n com 3 fluxos principais:\n\n### Fluxo 1: Captura e Qualificação\nWebhook → Typeform → Google Sheets → WhatsApp\n\n### Fluxo 2: Proposta Automática\nCRM Trigger → PDF Generator → Email → Slack\n\n### Fluxo 3: Follow-up Inteligente\nSchedule → WhatsApp → CRM Update\n\n## Resultados (3 meses)\n\n- 340% mais leads qualificados\n- Tempo de resposta: 2h → 2min\n- Taxa de conversão: 3% → 12%\n- Receita: R$ 18k → R$ 52k/mês\n\n## Lições Aprendidas\n\n1. Comece pequeno: automatize uma tarefa por vez\n2. Monitore: cada automação precisa de logs\n3. Itere: melhore baseado em dados\n4. Documente: mantenha documentação dos workflows`,
      categorySlug: 'cases-estudos', authorId: admin!.id, contentType: 'case', isPublished: true, isPremium: true, priceCents: 999,
      tags: ['case', 'vendas', 'automacao', 'n8n', 'resultados'], readTimeMinutes: 8, views: 4500,
    },
    {
      title: 'Guia Completo de TypeScript para React Developers',
      slug: 'guia-typescript-react',
      description: 'Do básico ao avançado: TypeScript no ecossistema React.',
      content: `# Guia Completo de TypeScript para React Developers\n\n## Introdução\n\nTypeScript se tornou essencial no ecossistema React. Este guia cobre do básico ao avançado.\n\n## Componentes Tipados\n\n\`\`\`tsx\ninterface ButtonProps {\n  variant: 'primary' | 'secondary' | 'ghost';\n  size: 'sm' | 'md' | 'lg';\n  children: React.ReactNode;\n  onClick?: () => void;\n  disabled?: boolean;\n}\n\nexport function Button({ variant, size, children, ...props }: ButtonProps) {\n  return (\n    <button className={clsx(styles[variant], styles[size])} {...props}>\n      {children}\n    </button>\n  );\n}\n\`\`\`\n\n## Generic Components\n\n\`\`\`tsx\ninterface ListProps<T> {\n  items: T[];\n  renderItem: (item: T) => React.ReactNode;\n}\n\nexport function List<T>({ items, renderItem }: ListProps<T>) {\n  return <ul>{items.map(renderItem)}</ul>;\n}\n\`\`\`\n\n## Padrões Avançados\n\n### Discriminated Unions para State\n\n\`\`\`tsx\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error };\n\`\`\`\n\n## Conclusão\n\nTypeScript não é só tipagem - é uma ferramenta de design que melhora a arquitetura do seu código React.`,
      categorySlug: 'tutoriais', authorId: pedro!.id, contentType: 'tutorial', isPublished: true,
      tags: ['typescript', 'react', 'frontend', 'tutorial'], readTimeMinutes: 12, views: 3800,
    },
    {
      title: 'Prompt Engineering: Técnicas Avançadas para 2026',
      slug: 'prompt-engineering-avancado-2026',
      description: 'Técnicas comprovadas de prompt engineering para LLMs modernos.',
      content: `# Prompt Engineering: Técnicas Avançadas para 2026\n\nO prompt engineering evoluiu muito. Aqui estão as técnicas que funcionam com LLMs modernos.\n\n## Chain-of-Thought (CoT)\n\nEm vez de pedir resposta direta, peça raciocínio passo a passo:\n\n> "Vamos pensar passo a passo: [problema]. Primeiro, vamos identificar os dados relevantes. Segundo, aplicar a fórmula. Terceiro, verificar o resultado."\n\n## Few-Shot com Exemplos Negativos\n\nInclua exemplos do que NÃO fazer:\n\n> "Aqui está um exemplo de resposta BOA: [exemplo]\n> Aqui está um exemplo de resposta RUIM: [exemplo]\n> Agora responda para: [input]"\n\n## System Prompts Estruturados\n\n\`\`\`\nVocê é um [persona] especializado em [domínio].\n\nDiretrizes:\n- Tom: [formal/casual/técnico]\n- Formato: [bullet points/tabela/parágrafo]\n- Extensão: [curto/médio/extenso]\n\nRestrições:\n- Não invente dados\n- Peça confirmação se faltar contexto\n- Use fontes confiáveis apenas\n\nContexto: [informações relevantes]\nTarefa: [instrução específica]\n\`\`\`\n\n## Técnica de Personas Multiplas\n\nPeça para o modelo assumir múltiplas perspectivas:\n\n> "Atue como um engenheiro, um designer e um product manager. Cada um dá sua visão sobre [problema]. Depois, synthesize as 3 visões em uma recomendação final."`,
      categorySlug: 'guias-rapidos', authorId: joao!.id, contentType: 'guia', isPublished: true, isPremium: true, priceCents: 1299,
      tags: ['prompt-engineering', 'ia', 'llm', 'avancado'], readTimeMinutes: 9, views: 6700,
    },
    {
      title: 'Automatizando deploys com GitHub Actions + Vercel',
      slug: 'github-actions-vercel-deploy',
      description: 'Pipeline CI/CD completo com testes, lint e deploy automático.',
      content: `# Automatizando deploys com GitHub Actions + Vercel\n\nUm pipeline CI/CD bem configurado economiza horas por semana.\n\n## Estrutura do Pipeline\n\n\`\`\`yaml\nname: CI/CD\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  quality:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pnpm/action-setup@v2\n      - run: pnpm install\n      - run: pnpm lint\n      - run: pnpm typecheck\n\n  test:\n    needs: quality\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pnpm install\n      - run: pnpm test -- --run\n\n  build:\n    needs: test\n    steps:\n      - run: pnpm build\n\n  deploy:\n    needs: build\n    if: github.ref == 'refs/heads/main'\n    steps:\n      - uses: amondnet/vercel-action@v20\n        with:\n          vercel-token: \${{ secrets.VERCEL_TOKEN }}\n          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}\n          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}\n\`\`\`\n\n## Benefícios\n\n- Qualidade garantida em cada PR\n- Testes rodam antes do build\n- Deploy automático na main\n- Rollback em 1 clique via Vercel\n\n## Dicas\n\n1. Use cache para acelerar instalação de dependências\n2. Parallelize jobs independentes\n3. Use matrix strategy para testar múltiplas versões\n4. Configure status checks obrigatórios no GitHub`,
      categorySlug: 'documentacao', authorId: pedro!.id, contentType: 'documentacao', isPublished: true,
      tags: ['github-actions', 'ci-cd', 'vercel', 'devops'], readTimeMinutes: 7, views: 1500,
    },
    {
      title: 'Guia de Migração do Supabase Auth para Next.js 15',
      slug: 'migracao-supabase-auth-nextjs-15',
      description: 'Passo a passo da migração com as novas APIs do Supabase SSR.',
      content: `# Guia de Migração do Supabase Auth para Next.js 15\n\nCom o lançamento do Next.js 15, as APIs do Supabase SSR mudaram. Aqui está o guia de migração.\n\n## Novidades\n\n\`\`\`typescript\n// Antigo (Next.js 14)\nconst supabase = createClientComponentClient();\n\n// Novo (Next.js 15) - Server Components\nconst supabase = await createClient();\n\`\`\`\n\n## Middleware Atualizado\n\nO middleware agora usa cookies API do Next.js 15:\n\n\`\`\`typescript\n// apps/web/middleware.ts\nimport { createServerClient } from '@supabase/ssr';\n\nexport async function middleware(request: NextRequest) {\n  let supabaseResponse = NextResponse.next({ request });\n\n  const supabase = createServerClient(\n    process.env.NEXT_PUBLIC_SUPABASE_URL!,\n    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,\n    {\n      cookies: {\n        getAll() {\n          return request.cookies.getAll();\n        },\n        setAll(cookiesToSet) {\n          cookiesToSet.forEach(({ name, value }) =>\n            request.cookies.set(name, value),\n          );\n          supabaseResponse = NextResponse.next({ request });\n          cookiesToSet.forEach(({ name, value, options }) =>\n            supabaseResponse.cookies.set(name, value, options),\n          );\n        },\n      },\n    },\n  );\n\n  return supabaseResponse;\n}\n\`\`\`\n\n## Boas Práticas\n\n1. Sempre use \`await\` para criar o client (agora async)\n2. Middleware deve usar Response para cookies funcionarem\n3. Route Handlers precisam do mesmo padrão de cookies\n4. Server Components podem acessar sessão diretamente`,
      categorySlug: 'tutoriais', authorId: admin!.id, contentType: 'tutorial', isPublished: true,
      tags: ['supabase', 'nextjs', 'auth', 'migracao'], readTimeMinutes: 6, views: 2800,
    },
    {
      title: 'Os 5 Pilares de uma Aplicação SaaS de Sucesso',
      slug: '5-pilares-saas-sucesso',
      description: 'O que aprendemos construindo e escalando SaaS para milhares de usuários.',
      content: `# Os 5 Pilares de uma Aplicação SaaS de Sucesso\n\nDepois de construir e escalar múltiplos SaaS, identifiquei 5 pilares essenciais.\n\n## 1. Autenticação e Autorização Robusta\n\n- SSO (Google, GitHub, Apple)\n- RBAC (Role-Based Access Control)\n- Equipes e convites\n- Audit logging\n\n## 2. Pagamentos e Assinaturas\n\n- Stripe como processador principal\n- Planos (free, pro, enterprise)\n- Trial sem cartão\n- Upgrade/downgrade automático\n\n## 3. Performance e Escalabilidade\n\n- CDN para assets estáticos\n- Redis para cache\n- Database connection pooling\n- Image optimization\n- Edge functions para lógica global\n\n## 4. UX e Onboarding\n\n- Time-to-value em < 5 minutos\n- Progressão guiada\n- Empty states úteis\n- Feedback loops constantes\n\n## 5. Analytics e Métricas\n\n- PostHog para produto analytics\n- Sentry para errors\n- Métricas de negócio (MRR, churn, LTV)\n- Dashboards em tempo real\n\n## Conclusão\n\nNão tente fazer tudo de uma vez. Comece com auth + pagamentos básicos, depois adicione os outros pilares.`,
      categorySlug: 'cases-estudos', authorId: admin!.id, contentType: 'case', isPublished: true,
      tags: ['saas', 'arquitetura', 'produto', 'estrategia'], readTimeMinutes: 8, views: 3200,
    },
  ];

  for (const { categorySlug, ...a } of articleData) {
    await db.insert(articles).values({
      ...a,
      categoryId: acMap[categorySlug]?.id,
      tags: a.tags as [string, ...string[]],
    }).onConflictDoNothing();
  }
  console.log(`  ${articleData.length} artigos criados`);

  // ─── WORKFLOW CATEGORIES ─────────────────────────────────
  const wcData = [
    { name: 'Automação', slug: 'automacao', icon: '⚡' },
    { name: 'Integração', slug: 'integracao', icon: '🔗' },
    { name: 'Notificação', slug: 'notificacao', icon: '🔔' },
    { name: 'Marketing', slug: 'marketing-wf', icon: '📢' },
    { name: 'Vendas', slug: 'vendas-wf', icon: '💰' },
    { name: 'Produtividade', slug: 'produtividade-wf', icon: '⚡' },
  ];
  for (const wc of wcData) {
    await db.insert(workflowCategories).values(wc).onConflictDoNothing();
  }
  const wcMap: Record<string, typeof workflowCategories.$inferSelect> = {};
  for (const wc of wcData) {
    const [row] = await db.select().from(workflowCategories).where(eq(workflowCategories.slug, wc.slug)).limit(1);
    if (row) wcMap[wc.slug] = row;
  }

  // ─── WORKFLOWS ───────────────────────────────────────────
  const workflowData = [
    {
      title: 'Webhook para Email com Template',
      slug: 'webhook-to-email-template',
      description: 'Recebe dados via webhook, formata em template HTML e envia email.',
      workflowJson: { name: 'Webhook to Email', nodes: [{ id: '1', name: 'Webhook', type: 'n8n-nodes-base.webhook', position: [240, 300], parameters: { httpMethod: 'POST', path: 'lead', responseMode: 'onReceived' } }, { id: '2', name: 'Set Template', type: 'n8n-nodes-base.set', position: [500, 300], parameters: { values: { string: [{ name: 'html', value: "<h1>Novo Lead</h1><p>Nome: {{$json.name}}</p><p>Email: {{$json.email}}</p>" }] } } }, { id: '3', name: 'Send Email', type: 'n8n-nodes-base.emailSend', position: [760, 300], parameters: { fromEmail: 'contato@prompthub.com', toEmail: '{{$json.email}}', subject: 'Obrigado pelo contato!', htmlBody: '={{$json.html}}' } }], connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] }, '2': { main: [[{ node: '3', type: 'main', index: 0 }]] } } },
      categorySlug: 'automacao', authorId: admin!.id, isPublished: true,
      tags: ['webhook', 'email', 'template', 'automacao'], downloads: 1200, views: 4500,
    },
    {
      title: 'Leads do Typeform para CRM e WhatsApp',
      slug: 'typeform-to-crm-whatsapp',
      description: 'Captura leads do Typeform, registra no CRM e envia WhatsApp automático.',
      workflowJson: { name: 'Typeform to CRM + WhatsApp', nodes: [{ id: '1', name: 'Typeform Trigger', type: 'n8n-nodes-base.typeformTrigger', position: [240, 300], parameters: {} }, { id: '2', name: 'Google Sheets', type: 'n8n-nodes-base.googleSheets', position: [500, 200], parameters: { operation: 'append', sheetId: '{{$env.SHEET_ID}}', columns: { mapping: { name: '={{$json["nome"]}}', email: '={{$json["email"]}}', phone: '={{$json["telefone"]}}' } } } }, { id: '3', name: 'WhatsApp', type: 'n8n-nodes-base.venom', position: [500, 450], parameters: { message: 'Olá {{$json.name}}! Recebemos seu contato. Em breve retornaremos.' } }], connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }, { node: '3', type: 'main', index: 0 }]] } } },
      categorySlug: 'marketing-wf', authorId: ana!.id, isPublished: true,
      tags: ['typeform', 'crm', 'whatsapp', 'leads'], downloads: 890, views: 3200,
    },
    {
      title: 'Monitor de Preços com Alerta no Slack',
      slug: 'monitor-precos-slack-alerta',
      description: 'Monitora preços de produtos em lojas online e envia alerta no Slack quando muda.',
      workflowJson: { name: 'Price Monitor + Slack Alert', nodes: [{ id: '1', name: 'Schedule', type: 'n8n-nodes-base.scheduleTrigger', position: [240, 300], parameters: { rule: { interval: 3600 } } }, { id: '2', name: 'HTTP Request', type: 'n8n-nodes-base.httpRequest', position: [500, 300], parameters: { url: 'https://api.mercadolibre.com/items/$ITEM_ID', method: 'GET' } }, { id: '3', name: 'Compare Price', type: 'n8n-nodes-base.code', position: [760, 300], parameters: { jsCode: 'const before = $env.LAST_PRICE\nconst now = $json.body.price\n\nif (now < before * 0.9) {\n  return { alert: true, old: before, new: now, drop: ((before - now) / before * 100).toFixed(1) }\n}\nreturn { alert: false }' } }, { id: '4', name: 'IF Condition', type: 'n8n-nodes-base.if', position: [1020, 300], parameters: { conditions: { number: [{ value1: '={{$json.alert}}', operation: 'equal', value2: true }] } } }, { id: '5', name: 'Slack', type: 'n8n-nodes-base.slack', position: [1280, 300], parameters: { channel: '#price-alerts', text: '🚨 QUEDA DE PREÇO! {{$json.drop}}% de desconto!' } }], connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] }, '2': { main: [[{ node: '3', type: 'main', index: 0 }]] }, '3': { main: [[{ node: '4', type: 'main', index: 0 }]] }, '4': { main: [[{ node: '5', type: 'main', index: 0 }]] } } },
      categorySlug: 'notificacao', authorId: pedro!.id, isPublished: true,
      tags: ['monitor', 'preco', 'slack', 'alerta'], downloads: 560, views: 2100,
    },
    {
      title: 'Backup Automático do Banco de Dados',
      slug: 'backup-automatico-banco-dados',
      description: 'Gera backup do PostgreSQL e envia para armazenamento cloud.',
      workflowJson: { name: 'Database Backup', nodes: [{ id: '1', name: 'Schedule Weekly', type: 'n8n-nodes-base.scheduleTrigger', position: [240, 300], parameters: { rule: { hour: 3, minute: 0, dayOfWeek: 0 } } }, { id: '2', name: 'Execute Command', type: 'n8n-nodes-base.executeCommand', position: [500, 300], parameters: { command: 'pg_dump -U $USER -h $HOST $DB > /backup/db_$(date +%Y%m%d).sql' } }, { id: '3', name: 'Upload S3', type: 'n8n-nodes-base.s3', position: [760, 300], parameters: { operation: 'upload', bucket: 'backups-prod', key: '={{$now.format("YYYY-MM-DD") + "/backup.sql"}}' } }, { id: '4', name: 'Notify', type: 'n8n-nodes-base.slack', position: [1020, 300], parameters: { channel: '#devops', text: '✅ Backup concluído: {{$now.format("YYYY-MM-DD")}}' } }], connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] }, '2': { main: [[{ node: '3', type: 'main', index: 0 }]] }, '3': { main: [[{ node: '4', type: 'main', index: 0 }]] } } },
      categorySlug: 'automacao', authorId: admin!.id, isPublished: true,
      tags: ['backup', 'database', 's3', 'devops'], downloads: 340, views: 1500,
    },
    {
      title: 'Integração Shopify + Planilha de Pedidos',
      slug: 'shopify-to-sheets-pedidos',
      description: 'Sincroniza pedidos do Shopify com uma planilha do Google Sheets.',
      workflowJson: { name: 'Shopify → Google Sheets', nodes: [{ id: '1', name: 'Shopify Trigger', type: 'n8n-nodes-base.shopifyTrigger', position: [240, 300], parameters: { event: 'orders/create' } }, { id: '2', name: 'Format Order', type: 'n8n-nodes-base.code', position: [500, 300], parameters: { jsCode: 'const order = $json\nreturn {\n  orderId: order.id,\n  customer: `${order.customer.first_name} ${order.customer.last_name}`,\n  email: order.email,\n  total: order.total_price,\n  items: order.line_items.map(i => i.name).join(", "),\n  date: order.created_at\n}' } }, { id: '3', name: 'Google Sheets', type: 'n8n-nodes-base.googleSheets', position: [760, 300], parameters: { operation: 'append', sheetId: '{{$env.ORDERS_SHEET_ID}}', columns: { mapping: {} } } }], connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] }, '2': { main: [[{ node: '3', type: 'main', index: 0 }]] } } },
      categorySlug: 'integracao', authorId: ana!.id, isPublished: true,
      tags: ['shopify', 'ecommerce', 'sheets', 'integracao'], downloads: 670, views: 2800,
    },
    {
      title: 'Envio de Newsletter com Conteúdo do Blog',
      slug: 'newsletter-blog-rss',
      description: 'Pega últimos posts do blog via RSS e envia newsletter semanal.',
      workflowJson: { name: 'RSS → Newsletter', nodes: [{ id: '1', name: 'Schedule Weekly', type: 'n8n-nodes-base.scheduleTrigger', position: [240, 300], parameters: { rule: { hour: 9, minute: 0, dayOfWeek: 2 } } }, { id: '2', name: 'RSS Feed Read', type: 'n8n-nodes-base.rssFeedRead', position: [500, 300], parameters: { url: 'https://blog.prompthub.com/rss' } }, { id: '3', name: 'HTML Template', type: 'n8n-nodes-base.code', position: [760, 300], parameters: { jsCode: 'const posts = $json\nlet html = `<h1>Novidades da Semana</h1>`\nposts.forEach(p => {\n  html += `<h2><a href="${p.link}">${p.title}</a></h2>`\n  html += `<p>${p.contentSnippet.slice(0, 200)}...</p>`\n})\nreturn { html }' } }, { id: '4', name: 'Send Email (Bulk)', type: 'n8n-nodes-base.emailSend', position: [1020, 300], parameters: { fromEmail: 'newsletter@prompthub.com', subject: '📬 Novidades do Blog', htmlBody: '={{$json.html}}' } }], connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] }, '2': { main: [[{ node: '3', type: 'main', index: 0 }]] }, '3': { main: [[{ node: '4', type: 'main', index: 0 }]] } } },
      categorySlug: 'marketing-wf', authorId: joao!.id, isPublished: true,
      tags: ['newsletter', 'rss', 'email', 'marketing'], downloads: 780, views: 3100,
    },
    {
      title: 'Chatbot Telegram com OpenAI',
      slug: 'chatbot-telegram-openai',
      description: 'Bot do Telegram que responde perguntas usando a API da OpenAI.',
      workflowJson: { name: 'Telegram + OpenAI Chat', nodes: [{ id: '1', name: 'Telegram Trigger', type: 'n8n-nodes-base.telegramTrigger', position: [240, 300], parameters: {} }, { id: '2', name: 'OpenAI Chat', type: 'n8n-nodes-base.openAi', position: [500, 300], parameters: { model: 'gpt-4', messages: [{ role: 'system', content: 'Você é um assistente útil.' }, { role: 'user', content: '={{$json.message.text}}' }] } }, { id: '3', name: 'Send Message', type: 'n8n-nodes-base.telegram', position: [760, 300], parameters: { chatId: '={{$json.chat.id}}', text: '={{$json.choices[0].message.content}}' } }], connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] }, '2': { main: [[{ node: '3', type: 'main', index: 0 }]] } } },
      categorySlug: 'integracao', authorId: pedro!.id, isPublished: true, isPremium: true, priceCents: 1999,
      tags: ['telegram', 'openai', 'chatbot', 'ia'], downloads: 920, views: 5600,
    },
    {
      title: 'Aprovador de Conteúdo com Notificação',
      slug: 'aprovador-conteudo-notificacao',
      description: 'Fluxo de aprovação: submissão → notifica admin → aprova/rejeita → email automático.',
      workflowJson: { name: 'Content Approval Workflow', nodes: [{ id: '1', name: 'Webhook', type: 'n8n-nodes-base.webhook', position: [240, 300], parameters: { httpMethod: 'POST', path: 'content-submission' } }, { id: '2', name: 'Save to DB', type: 'n8n-nodes-base.executeQuery', position: [500, 300], parameters: { query: 'INSERT INTO content_submissions (title, content, author_email) VALUES ($1, $2, $3) RETURNING id', values: ['={{$json.title}}', '={{$json.content}}', '={{$json.email}}'] } }, { id: '3', name: 'Slack Admin', type: 'n8n-nodes-base.slack', position: [760, 300], parameters: { channel: '#content-review', text: '📝 Nova submissão de "{{$json.title}}" por {{$json.email}}' } }, { id: '4', name: 'Wait for Approval', type: 'n8n-nodes-base.wait', position: [1020, 300], parameters: { resume: 'webhook', options: { webhookSuffix: 'approve-{{$json.id}}' } } }, { id: '5', name: 'Send Result', type: 'n8n-nodes-base.emailSend', position: [1280, 300], parameters: { toEmail: '={{$json.email}}', subject: 'Sua submissão foi {{$json.approved ? "aprovada" : "rejeitada"}}' } }], connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] }, '2': { main: [[{ node: '3', type: 'main', index: 0 }]] }, '3': { main: [[{ node: '4', type: 'main', index: 0 }]] }, '4': { main: [[{ node: '5', type: 'main', index: 0 }]] } } },
      categorySlug: 'notificacao', authorId: admin!.id, isPublished: true,
      tags: ['aprovacao', 'conteudo', 'workflow', 'moderacao'], downloads: 430, views: 1800,
    },
    {
      title: 'Geração de Relatório Semanal de Vendas',
      slug: 'relatorio-semanal-vendas',
      description: 'Agrega dados de vendas da semana, gera PDF e envia por email.',
      workflowJson: { name: 'Weekly Sales Report', nodes: [{ id: '1', name: 'Schedule', type: 'n8n-nodes-base.scheduleTrigger', position: [240, 300], parameters: { rule: { hour: 8, minute: 0, dayOfWeek: 1 } } }, { id: '2', name: 'Query Vendas', type: 'n8n-nodes-base.executeQuery', position: [500, 300], parameters: { query: "SELECT COUNT(*) as total_vendas, SUM(amount) as receita, AVG(ticket) as ticket_medio FROM vendas WHERE created_at >= NOW() - INTERVAL '7 days'" } }, { id: '3', name: 'Generate PDF', type: 'n8n-nodes-base.htmlToPdf', position: [760, 300], parameters: { html: '<h1>Relatório Semanal</h1><p>Vendas: {{$json.total_vendas}}</p><p>Receita: R$ {{$json.receita}}</p><p>Ticket Médio: R$ {{$json.ticket_medio}}</p>' } }, { id: '4', name: 'Send Email with PDF', type: 'n8n-nodes-base.emailSend', position: [1020, 300], parameters: { toEmail: 'gestor@empresa.com', subject: '📊 Relatório Semanal de Vendas', attachments: ['={{$json.file}}'] } }], connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] }, '2': { main: [[{ node: '3', type: 'main', index: 0 }]] }, '3': { main: [[{ node: '4', type: 'main', index: 0 }]] } } },
      categorySlug: 'vendas-wf', authorId: ana!.id, isPublished: true, isPremium: true, priceCents: 1499,
      tags: ['relatorio', 'vendas', 'pdf', 'email'], downloads: 290, views: 1300,
    },
    {
      title: 'Sincronização Google Calendar + Todoist',
      slug: 'google-calendar-todoist-sync',
      description: 'Cria tasks no Todoist automaticamente baseado em eventos do Google Calendar.',
      workflowJson: { name: 'Calendar → Tasks', nodes: [{ id: '1', name: 'Google Calendar Trigger', type: 'n8n-nodes-base.googleCalendarTrigger', position: [240, 300], parameters: { watch: true } }, { id: '2', name: 'Filter', type: 'n8n-nodes-base.if', position: [500, 300], parameters: { conditions: { string: [{ value1: '={{$json.status}}', operation: 'equal', value2: 'confirmed' }] } } }, { id: '3', name: 'Todoist', type: 'n8n-nodes-base.todoist', position: [760, 300], parameters: { operation: 'create', content: '={{$json.summary}}', description: '={{$json.description}}\n\n📍 {{$json.location}}', dueDate: '={{$json.start.date}}', priority: 3 } }], connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] }, '2': { main: [[{ node: '3', type: 'main', index: 0 }]] } } },
      categorySlug: 'produtividade-wf', authorId: pedro!.id, isPublished: false,
      tags: ['google-calendar', 'todoist', 'sync', 'produtividade'], downloads: 120, views: 800,
    },
  ];

  for (const { categorySlug, ...w } of workflowData) {
    await db.insert(workflows).values({
      ...w,
      categoryId: wcMap[categorySlug]?.id,
      tags: w.tags as [string, ...string[]],
    }).onConflictDoNothing();
  }
  console.log(`  ${workflowData.length} workflows criados (inline)`);

  // ─── EXTERNAL WORKFLOWS (open-source) ──────────────────
  let extCount = 0;
  for (const ext of externalWorkflows) {
    const workflowJson = loadExternalWorkflowJson(ext.filename);
    if (!workflowJson) continue;

    await db.insert(workflows).values({
      title: ext.title,
      slug: ext.slug,
      description: ext.description,
      workflowJson,
      categoryId: wcMap[ext.categorySlug]?.id,
      authorId: admin!.id,
      isPublished: true,
      isPremium: ext.isPremium,
      priceCents: ext.priceCents,
      tags: ext.tags as [string, ...string[]],
      downloads: Math.floor(Math.random() * 200) + 10,
      views: Math.floor(Math.random() * 800) + 50,
    }).onConflictDoNothing();
    extCount++;
  }
  console.log(`  ${extCount} workflows importados de repositórios open-source`);

  // ─── SKILL CATEGORIES ────────────────────────────────────
  const scData = [
    { name: 'Engenharia', slug: 'engenharia', icon: '💻' },
    { name: 'DevOps', slug: 'devops', icon: '⚙️' },
    { name: 'IA', slug: 'ia', icon: '🤖' },
    { name: 'Design', slug: 'design', icon: '🎨' },
    { name: 'Marketing', slug: 'marketing', icon: '📢' },
    { name: 'Dados', slug: 'dados', icon: '📊' },
    { name: 'Conteúdo', slug: 'conteudo', icon: '✍️' },
  ];
  for (const sc of scData) {
    await db.insert(skillCategories).values(sc).onConflictDoNothing();
  }
  const scMap: Record<string, typeof skillCategories.$inferSelect> = {};
  for (const sc of scData) {
    const [row] = await db.select().from(skillCategories).where(eq(skillCategories.slug, sc.slug)).limit(1);
    if (row) scMap[sc.slug] = row;
  }
  console.log(`  ${scData.length} categorias de skills criadas`);

  // ─── EXTERNAL SKILLS ────────────────────────────────────
  let skillCount = 0;
  for (const ext of externalSkills) {
    const content = loadExternalSkillContent(ext.filename);
    if (!content) continue;

    await db.insert(skills).values({
      title: ext.title,
      slug: ext.slug,
      description: ext.description,
      content,
      platform: ext.platform as [string, ...string[]],
      categoryId: scMap[ext.categorySlug]?.id,
      authorId: admin!.id,
      isPublished: true,
      isPremium: ext.isPremium,
      priceCents: ext.priceCents,
      tags: ext.tags as [string, ...string[]],
      source: ext.source,
      downloads: Math.floor(Math.random() * 150) + 5,
      views: Math.floor(Math.random() * 600) + 30,
    }).onConflictDoNothing();
    skillCount++;
  }
  console.log(`  ${skillCount} skills importadas de repositórios open-source`);

  // ─── AGENT CATEGORIES ────────────────────────────────────
  const acData2 = [
    { name: 'Engenharia', slug: 'engenharia', icon: '💻' },
    { name: 'DevOps', slug: 'devops', icon: '⚙️' },
    { name: 'Design', slug: 'design', icon: '🎨' },
    { name: 'Marketing', slug: 'marketing', icon: '📢' },
    { name: 'Dados', slug: 'dados', icon: '📊' },
    { name: 'Conteúdo', slug: 'conteudo', icon: '✍️' },
  ];
  for (const ac of acData2) {
    await db.insert(agentCategories).values(ac).onConflictDoNothing();
  }
  const acMap2: Record<string, typeof agentCategories.$inferSelect> = {};
  for (const ac of acData2) {
    const [row] = await db.select().from(agentCategories).where(eq(agentCategories.slug, ac.slug)).limit(1);
    if (row) acMap2[ac.slug] = row;
  }
  console.log(`  ${acData2.length} categorias de agents criadas`);

  // ─── EXTERNAL AGENTS ────────────────────────────────────
  let agentCount = 0;
  for (const ext of externalAgents) {
    const content = loadExternalAgentContent(ext.filename);
    if (!content) continue;

    await db.insert(agents).values({
      title: ext.title,
      slug: ext.slug,
      description: ext.description,
      content,
      platform: ext.platform as [string, ...string[]],
      categoryId: acMap2[ext.categorySlug]?.id,
      authorId: admin!.id,
      isPublished: true,
      isPremium: ext.isPremium,
      priceCents: ext.priceCents,
      tags: ext.tags as [string, ...string[]],
      source: ext.source,
      color: ext.color,
      downloads: Math.floor(Math.random() * 200) + 10,
      views: Math.floor(Math.random() * 800) + 50,
    }).onConflictDoNothing();
    agentCount++;
  }
  console.log(`  ${agentCount} agents importados de repositórios open-source`);

  // ─── COLLECTIONS ─────────────────────────────────────────
  const [collection] = await db.insert(collections).values({
    userId: maria!.id,
    name: 'Meus Prompts Favoritos',
    description: 'Os melhores prompts que encontrei na plataforma.',
    isPrivate: false,
  }).onConflictDoNothing().returning();

  if (collection) {
    const favPrompts = await db.select({ id: prompts.id }).from(prompts).limit(5);
    for (const p of favPrompts) {
      await db.insert(collectionPrompts).values({
        collectionId: collection.id,
        promptId: p.id,
      }).onConflictDoNothing();
    }
  }
  console.log(`  1 coleção criada com 5 prompts`);

  // ─── DOWNLOAD HISTORY ────────────────────────────────────
  const downPrompts = await db.select({ id: prompts.id }).from(prompts).limit(3);
  for (const p of downPrompts) {
    await db.insert(downloadHistory).values({
      userId: maria!.id,
      promptId: p.id,
      format: 'md',
    }).onConflictDoNothing();
  }
  console.log(`  ${downPrompts.length} downloads registrados`);

  // ─── SALES ───────────────────────────────────────────────
  const [soldPrompt] = await db.select({ id: prompts.id }).from(prompts).where(gt(prompts.priceCents, 0)).limit(1);
  if (soldPrompt) {
    const [seller] = await db.select({ id: creators.id }).from(creators).limit(1);
    if (seller) {
      await db.insert(sales).values({
        promptId: soldPrompt.id,
        buyerId: pedro!.id,
        creatorId: seller.id,
        amountCents: 1499,
        platformFeeCents: 450,
        creatorEarningsCents: 1049,
        stripePaymentIntent: 'pi_test_seed',
      }).onConflictDoNothing();
      console.log('  1 venda registrada');
    }
  }

  // ─── PURCHASES ────────────────────────────────────────────
  await db.insert(purchases).values({
    userId: pedro!.id,
    contentType: 'prompt',
    contentId: soldPrompt?.id ?? '00000000-0000-0000-0000-000000000000',
    amountCents: 1499,
    platformFeeCents: 450,
    creatorEarningsCents: 1049,
    status: 'completed',
  }).onConflictDoNothing();
  console.log('  1 compra registrada');

  // ─── PAYOUTS ──────────────────────────────────────────────
  const [joaoCreator] = await db.select({ id: creators.id }).from(creators).where(eq(creators.userId, joao!.id)).limit(1);
  const [anaCreator] = await db.select({ id: creators.id }).from(creators).where(eq(creators.userId, ana!.id)).limit(1);
  if (joaoCreator) {
    await db.insert(payouts).values({
      creatorId: joaoCreator.id,
      amountCents: 50000,
      status: 'paid',
      stripeTransferId: 'tr_test_001',
      notes: 'Saque processado via Stripe Connect',
      processedAt: new Date('2026-06-15'),
    }).onConflictDoNothing();
  }
  if (anaCreator) {
    await db.insert(payouts).values({
      creatorId: anaCreator.id,
      amountCents: 30000,
      status: 'pending',
      notes: 'Aguardando processamento',
    }).onConflictDoNothing();
  }
  console.log('  2 saques registrados');

  console.log('\n✅ Seed concluído com sucesso!');
  process.exit(0);
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
