# 🚀 PromptHub — SaaS de Biblioteca de Prompts Prontos

> **MVP** — Documento completo de especificação, arquitetura e estratégia
> **Data:** Julho 2026

---

## Sumário

1. [Visão do Produto](#1-visão-do-produto)
2. [Pesquisa de Mercado & Concorrência](#2-pesquisa-de-mercado--concorrência)
3. [Diferenciais & Oportunidade](#3-diferenciais--oportunidade)
4. [Modelo de Monetização](#4-modelo-de-monetização)
5. [Arquitetura & Stack](#5-arquitetura--stack)
6. [Modelo de Dados](#6-modelo-de-dados)
7. [MVP Feature Set](#7-mvp-feature-set)
8. [UX/UI & Design System](#8-uxui--design-system)
9. [Fases de Desenvolvimento](#9-fases-de-desenvolvimento)
10. [Estratégia de Testes](#10-estratégia-de-testes)
11. [CI/CD & Deploy](#11-cicd--deploy)
12. [Estrutura de Diretórios](#12-estrutura-de-diretórios)

---

## 1. Visão do Produto

### O que é?

**PromptHub** é uma plataforma SaaS onde usuários encontram, buscam e baixam prompts prontos para IA. Funciona como uma **biblioteca inteligente de prompts** — o usuário pesquisa dinamicamente por categoria, modelo AI, uso, idioma, e instantaneamente encontra o prompt ideal. Pode **copiar com 1 clique**, **baixar em PDF** ou **exportar em Markdown (.md)**.

### Para quem?

- **Desenvolvedores** — prompts técnicos, code generation, debugging
- **Profissionais de marketing** — copywriting, SEO, anúncios, redes sociais
- **Criadores de conteúdo** — roteiros, legendas, artes visuais
- **Designers** — prompts de imagem (Midjourney, DALL-E, Flux)
- **Educadores e estudantes** — prompts educacionais
- **Empresas** — prompts padronizados para times

### Modelo de Negócio

```
Freemium + Premium + Ads
├── 🆓 Gratuito
│   ├── Busca ilimitada
│   ├── Prompts gratuitos (curadoria)
│   ├── Download PDF/MD (com marca d'água ou limitado)
│   └── Anúncios AdSense
│
├── 💎 Pro ($9.90/mês ou $89/ano)
│   ├── Biblioteca completa (gratuitos + premium)
│   ├── Downloads ilimitados sem marca
│   ├── Pastas e coleções pessoais
│   ├── Histórico de prompts baixados
│   └── Sem anúncios
│
├── 🏢 Team ($29/mês — até 5 membros)
│   ├── Tudo do Pro
│   ├── Biblioteca compartilhada do time
│   ├── Prompts privados internos
│   └── Analytics de uso do time
│
└── 🔌 Pay-per-prompt (via Stripe)
    ├── Prompts individuais premium (venda avulsa)
    ├── Criadores podem vender seus prompts (marketplace)
    └── Comissão da plataforma: 30%
```

### Público-alvo por País

| País | Estratégia |
|------|-----------|
| **🇧🇷 Brasil** | Conteúdo em português, preço acessível (R$), foco em marketing e criação |
| **🇺🇸 EUA** | Conteúdo em inglês, mercado maior, foco em tech + business |
| **🇬🇧 Reino Unido** | Conteúdo em inglês UK, foco em produtividade e enterprise |

---

## 2. Pesquisa de Mercado & Concorrência

### Mercado Global

- **Tamanho do mercado (2026):** USD 2.6 bilhões
- **Crescimento:** CAGR 28.8% (atingindo USD 25.3 bi até 2035)
- **Demanda:** Crescendo exponencialmente com adoção de IA generativa

### Concorrentes no Brasil

| Concorrente | Modelo | Pontos Fortes | Fragilidades |
|------------|--------|---------------|--------------|
| **PromptsBR** (promptsbr.org) | Gratuito, comunidade | 148k+ prompts, fórum, 100% grátis, feito por BR | Sem monetização, sem download PDF/MD, sem busca avançada |
| **PromptGPT** (promptgpt.com.br) | Gratuito | Interface simples, categorias | Poucos prompts, sem plano pago |
| **Brainiall** (chat.brainiall.com) | Freemium | 561 templates, multi-modelo | Foco em chat próprio, não é biblioteca |
| **Treinamento SAF** | Blog gratuito | Conteúdo SEO, muitos visitantes | Não é plataforma, é blog |

### Concorrentes Globais (EUA/UK)

| Concorrente | Modelo | Pontos Fortes | Fragilidades |
|------------|--------|---------------|--------------|
| **PromptBase** | Marketplace pago | Milhões em vendas, criadores profissionais | Só inglês, sem plano freemium robusto |
| **FlowGPT** | Freemium | Comunidade grande, bots, multi-modelo | Foco em chat, não em biblioteca/download |
| **AIPRM** | Freemium ($9/mês) | Extensão Chrome, integração direta no ChatGPT | Só funciona como extensão, sem download |
| **Snack Prompt** | Freemium | Rede social + prompts, adquirido pela Spectral | Em transição, incerto |
| **KissMySkills** | Marketplace pago | Nichado em Claude, prompts profissionais | Pequeno, focado em um modelo |
| **SurePrompts** | Freemium ($3.99/mês) | Gerador de prompts, multi-modelo | Biblioteca pequena (100+ templates) |
| **PromptHero** | Gratuito + Pro | Imagens, busca visual | Foco só em image prompts |
| **PromptLibrary.org** | Gratuito (doações) | 25k+ prompts grátis | Sem busca avançada, interface simples |

### Oportunidade de Mercado

```
✅ O que EXISTE:           ❌ O que FALTA:
────────────────────────────────────────────────
Bibliotecas gratuitas      Biblioteca com busca dinâmica AVANÇADA
Marketplaces caros         Plano freemium justo (grátis + premium)
Foco em inglês             Suporte nativo PT-BR + EN + UK
Sites de blog com prompts  Download em PDF/MD organizado
Extensões de navegador     Plataforma web completa
Comunidades soltas         Curadoria profissional + qualidade
```

### Nosso Diferencial

1. **Busca Dinâmica Avançada** — Filtros por modelo AI, categoria, popularidade, data, preço, idioma
2. **Download em PDF e MD** — Pronto para usar em repositórios, docs, projetos
3. **Copy com 1 clique** — Zero atrito, copia formatado
4. **Dual-language (PT/EN)** — Mercados BR + EUA + UK no mesmo produto
5. **Freemium + Ads + Stripe** — Três pernas de receita
6. **Curadoria Profissional** — Qualidade acima de quantidade
7. **Marketplace para criadores** — Qualquer um pode vender seus prompts

---

## 3. Diferenciais & Oportunidade

### Análise SWOT

```
FORÇAS (S)
├── Suporte nativo PT-BR + EN + UK (3 mercados)
├── Monetização híbrida (Ads + Stripe)
├── Busca dinâmica avançada com múltiplos filtros
├── Download em PDF e MD (formato universal)
└── Stack moderna, escalável (Next 15 + Drizzle + Redis)

FRAQUEZAS (W)
├── Marca nova (sem audiência)
├── Conteúdo inicial precisa ser criado/curado
├── Concorrentes já estabelecidos
└── Dois idiomas = dobro de conteúdo inicial

OPORTUNIDADES (O)
├── Mercado crescendo 28.8% ao ano
├── Brasil sem marketplace de prompts (só grátis)
├── Profissionais querem prompts testados e prontos
├── Crescimento do uso de IA no Brasil
└── Venda como afiliado / programa de criadores

AMEAÇAS (T)
├── Google/OpenAI podem criar bibliotecas oficiais
├── Concorrentes gratuitos consolidados (PromptsBR)
├── Qualidade dos prompts precisa ser monitorada
└── Modelos de IA mudam rápido (prompts podem ficar obsoletos)
```

---

## 4. Modelo de Monetização

### 3 Pernas de Receita

```
                    ┌─────────────────────────┐
                    │     RECEITA TOTAL        │
                    └─────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   AdSense    │  │    Stripe    │  │  Marketplace │
│  (Gratuitos) │  │  (Planos)    │  │ (Comissão)   │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ • Anúncios   │  │ • Pro $9.90  │  │ • 30% por    │
│   nas págs   │  │ • Team $29   │  │   venda      │
│   gratuitas  │  │ • Anual +15% │  │ • Destaque   │
│ • Banner     │  │ • Upgrade    │  │   pago       │
│ • Nativo     │  │   automático │  │   (+5%)      │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Precificação Sugerida

| Plano | Brasil (R$) | EUA (USD) | UK (GBP) |
|-------|------------|-----------|----------|
| **Free** | R$ 0 | $0 | £0 |
| **Pro mensal** | R$ 29,90 | $9.90 | £7.90 |
| **Pro anual** | R$ 269 | $89 | £69 |
| **Team mensal** | R$ 89 | $29 | £22 |
| **Prompts individuais** | R$ 4,90–19,90 | $1.99–9.99 | £1.49–7.99 |

### AdSense
- Estimativa: 10–30 page views por prompt
- RPM médio Brasil: ~$2-5 (R$ 10-25)
- RPM médio EUA/UK: ~$5-15
- Meta: 100k page views/mês no primeiro ano

---

## 5. Arquitetura & Stack

```
┌──────────────────────────────────────────────────────┐
│                     VERCEL                           │
│  ┌────────────────────┐  ┌────────────────────────┐  │
│  │  Next.js 15 App     │  │  tRPC Router           │  │
│  │  (App Router)       │  │  (Procedures HTTP)     │  │
│  │                     │  │                        │  │
│  │  Pages:             │  │  Endpoints:            │  │
│  │  / → Home          │  │  prompt.list          │  │
│  │  /busca → Search   │  │  prompt.get           │  │
│  │  /prompt/[id]      │  │  prompt.search        │  │
│  │  /colecoes         │  │  prompt.download      │  │
│  │  /criadores        │  │  auth.*               │  │
│  │  /precos           │  │  user.*               │  │
│  │  /admin            │  │  payment.*            │  │
│  └────────────────────┘  └────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  React Server Components + TanStack Query      │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────────┐
│                 SUPABASE (PostgreSQL)                 │
│  ┌────────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │  Drizzle    │  │  Auth    │  │  Storage         │  │
│  │  ORM        │  │          │  │  (PDFs, avatars) │  │
│  │  Migrations │  │  OAuth   │  │                  │  │
│  │  Seeds      │  │  Magic   │  │  Row Level       │  │
│  │             │  │  Link    │  │  Security (RLS)  │  │
│  └────────────┘  └──────────┘  └─────────────────┘  │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────────┐
│              UPSTASH REDIS (Serverless)              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Cache       │  │  Rate Limit  │  │  Queue     │  │
│  │  (prompts)   │  │  (API)       │  │  (jobs)    │  │
│  └──────────────┘  └──────────────┘  └───────────┘  │
└──────────────────────────────────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────────┐
│              SERVIÇOS EXTERNOS                       │
│  ┌──────────┐  ┌───────────┐  ┌────────┐  ┌──────┐  │
│  │ Stripe   │  │ PostHog   │  │ Sentry │  │      │  │
│  │ Payments │  │ Analytics │  │ Errors │  │ Mail │  │
│  └──────────┘  └───────────┘  └────────┘  └──────┘  │
└──────────────────────────────────────────────────────┘
```

### Stack Completa

| Camada | Tecnologia | Versão | Motivo |
|--------|-----------|--------|--------|
| **Runtime** | Node.js | 22 LTS | Performance, suporte ES2024 |
| **Framework** | Next.js | 15 App Router | RSC, SSR, Vercel-native |
| **Linguagem** | TypeScript | 5.x strict | Type safety total |
| **ORM** | Drizzle ORM | 0.38+ | Type-safe, leve, SQL-like |
| **Database** | Supabase PostgreSQL | 15 | Serverless, escalável, RLS |
| **Auth** | Supabase Auth | — | OAuth, Magic Link, RBAC |
| **API Layer** | tRPC | 11 | Type-safe end-to-end |
| **Validação** | Zod | 3.x | Schemas compartilhados |
| **Cache/Queue** | Upstash Redis | — | Serverless, webhooks |
| **CSS** | Tailwind CSS | 4 | Utility-first, performance |
| **UI Kit** | shadcn/ui + Radix | latest | Acessível, customizável |
| **Estado** | TanStack Query | 5 | Server state + cache |
| **Forms** | React Hook Form | 7 | Performance, controlled |
| **Pagamento** | Stripe | latest | Checkout + Webhooks |
| **Analytics** | PostHog | latest | Eventos + Feature flags |
| **Erros** | Sentry | latest | Error tracking |
| **Testes unit** | Vitest + RTL | 2.x | Rápido, compatível Vite |
| **Testes e2e** | Playwright | latest | Multi-browser |
| **CI/CD** | GitHub Actions | — | Build + Test + Deploy |
| **Monorepo** | Turborepo + pnpm | latest | Workspaces, cache |

---

## 6. Modelo de Dados

### Drizzle Schema — Entidades Principais

```typescript
// ============================================
// SCHEMA: USERS & AUTH
// ============================================

// users
//   id: uuid PK default
//   email: text unique not null
//   name: text not null
//   avatar_url: text
//   locale: text default 'pt-BR'  ← pt-BR, en-US, en-GB
//   plan: plan_type default 'free'
//   stripe_customer_id: text unique
//   created_at: timestamp default now()
//   updated_at: timestamp

// plan_type enum: 'free' | 'pro' | 'team'

// ============================================
// SCHEMA: PROMPTS
// ============================================

// categories
//   id: uuid PK
//   name: text not null (ex: "Marketing", "Code", "Design")
//   slug: text unique not null
//   icon: text
//   parent_id: uuid nullable (auto-relacionamento)
//   created_at: timestamp

// prompts
//   id: uuid PK
//   title: text not null
//   slug: text unique not null
//   description: text
//   content: text not null (o prompt em si)
//   model: text[] (ex: ["chatgpt", "claude", "midjourney"])
//   category_id: uuid FK → categories
//   author_id: uuid FK → users
//   language: text default 'pt-BR' (pt-BR | en-US | en-GB)
//   price_cents: integer default 0 (0 = grátis)
//   downloads: integer default 0
//   views: integer default 0
//   rating_avg: decimal default 0
//   rating_count: integer default 0
//   is_published: boolean default false
//   is_featured: boolean default false
//   tags: text[] (ex: ["seo", "blog", "gpt-4"])
//   variables: jsonb (ex: [{"name": "topic", "type": "string"}])
//   created_at: timestamp
//   updated_at: timestamp

// prompt_files
//   id: uuid PK
//   prompt_id: uuid FK → prompts
//   format: text ('pdf' | 'md' | 'txt')
//   url: text not null
//   size_bytes: integer
//   created_at: timestamp

// ============================================
// SCHEMA: COLLECTIONS (Pastas pessoais)
// ============================================

// collections
//   id: uuid PK
//   user_id: uuid FK → users
//   name: text not null
//   description: text
//   is_private: boolean default true
//   created_at: timestamp

// collection_prompts
//   id: uuid PK
//   collection_id: uuid FK → collections
//   prompt_id: uuid FK → prompts
//   added_at: timestamp

// ============================================
// SCHEMA: DOWNLOADS & HISTORY
// ============================================

// download_history
//   id: uuid PK
//   user_id: uuid FK → users
//   prompt_id: uuid FK → prompts
//   format: text ('pdf' | 'md' | 'txt')
//   downloaded_at: timestamp

// ============================================
// SCHEMA: RATINGS & REVIEWS
// ============================================

// reviews
//   id: uuid PK
//   prompt_id: uuid FK → prompts
//   user_id: uuid FK → users
//   rating: integer (1-5)
//   comment: text
//   created_at: timestamp

// ============================================
// SCHEMA: MARKETPLACE (Criadores)
// ============================================

// creators
//   id: uuid PK
//   user_id: uuid FK → users unique
//   bio: text
//   stripe_account_id: text (conecta Stripe Connect)
//   total_earnings: integer (cents)
//   created_at: timestamp

// sales
//   id: uuid PK
//   prompt_id: uuid FK → prompts
//   buyer_id: uuid FK → users
//   creator_id: uuid FK → creators
//   amount_cents: integer
//   platform_fee_cents: integer (30%)
//   creator_earnings_cents: integer
//   stripe_payment_intent: text
//   created_at: timestamp

// ============================================
// SCHEMA: PLANS & SUBSCRIPTIONS
// ============================================

// subscriptions
//   id: uuid PK
//   user_id: uuid FK → users unique
//   plan: plan_type
//   stripe_subscription_id: text unique
//   status: text ('active' | 'canceled' | 'past_due')
//   current_period_start: timestamp
//   current_period_end: timestamp
//   created_at: timestamp

// ============================================
// SCHEMA: ANALYTICS
// ============================================

// page_views
//   id: uuid PK
//   prompt_id: uuid FK → prompts nullable
//   page: text (ex: "/prompt/abc", "/busca")
//   referrer: text
//   country: text
//   user_agent: text
//   viewed_at: timestamp

// ad_clicks
//   id: uuid PK
//   page: text
//   ad_provider: text ('adsense')
//   clicked_at: timestamp
```

### Índices Recomendados

```sql
-- Busca textual (postgres full-text search)
CREATE INDEX idx_prompts_search ON prompts
  USING GIN(to_tsvector('portuguese', title || ' ' || description || ' ' || content));
CREATE INDEX idx_prompts_search_en ON prompts
  USING GIN(to_tsvector('english', title || ' ' || description || ' ' || content));

-- Filtros comuns
CREATE INDEX idx_prompts_category ON prompts(category_id);
CREATE INDEX idx_prompts_model ON prompts USING GIN(model);
CREATE INDEX idx_prompts_language ON prompts(language);
CREATE INDEX idx_prompts_price ON prompts(price_cents);
CREATE INDEX idx_prompts_featured ON prompts(is_featured, rating_avg DESC);
```

---

## 7. MVP Feature Set

### 🔵 Fase 1 — Fundação (Semanas 1-3)

| Feature | Prioridade | Descrição |
|---------|-----------|-----------|
| Autenticação | 🔥 Crítica | Email + Google OAuth via Supabase |
| Landing Page | 🔥 Crítica | Home com busca, categorias, featured prompts |
| Busca de prompts | 🔥 Crítica | Full-text search + filtros (categoria, modelo, idioma) |
| Página do prompt | 🔥 Crítica | Visualização, copy, download PDF/MD |
| Categorias | 🔥 Crítica | Navegação por categorias |
| Cadastro de prompts (admin) | 🔥 Crítica | Admin para adicionar prompts |
| Plano Free | 🔥 Crítica | Busca ilimitada, downloads limitados, ads |

### 🟢 Fase 2 — Download & Coleções (Semanas 4-6)

| Feature | Prioridade | Descrição |
|---------|-----------|-----------|
| Download PDF | 🔥 Alta | Geração de PDF com formatação |
| Download MD | 🔥 Alta | Exportação em Markdown |
| Copy com 1 clique | 🔥 Alta | Copia prompt formatado |
| Coleções pessoais | 🔥 Alta | Pastas para organizar prompts |
| Histórico de downloads | 🔥 Alta | Ver prompts baixados |
| Avaliação (rating) | 🔥 Alta | Estrelas + comentários |

### 🟡 Fase 3 — Premium & Monetização (Semanas 7-9)

| Feature | Prioridade | Descrição |
|---------|-----------|-----------|
| Checkout Stripe Pro | 🔥 Alta | Plano mensal/anual |
| Checkout Stripe Team | 🔥 Alta | Plano para times |
| Plano Free vs Pro | 🔥 Alta | Limites e upgrades |
| Stripe Webhooks | 🔥 Alta | Sincronização automática |
| Remover anúncios (Pro) | 🔥 Alta | Pro = sem ads |
| Downloads ilimitados (Pro) | 🔥 Alta | Pro = sem limites |

### 🟣 Fase 4 — Marketplace & Criadores (Semanas 10-12)

| Feature | Prioridade | Descrição |
|---------|-----------|-----------|
| Cadastro de criadores | 🔥 Média | Criadores podem vender prompts |
| Stripe Connect | 🔥 Média | Pagamento automático para criadores |
| Página do criador | 🔥 Média | Perfil com prompts dele |
| Venda avulsa de prompts | 🔥 Média | Pay-per-prompt via Stripe |
| Comissão automática (30%) | 🔥 Média | Split de pagamento |

### 🟠 Fase 5 — Analytics & Ads (Semanas 13-14)

| Feature | Prioridade | Descrição |
|---------|-----------|-----------|
| PostHog analytics | 📊 Média | Eventos, page views, funis |
| AdSense integration | 💰 Média | Anúncios nas páginas gratuitas |
| Dashboard de admin | 📊 Média | Visão geral do negócio |
| SEO optimization | 🔥 Alta | Meta tags, sitemap, structured data |

---

## 8. UX/UI & Design System

### Paleta de Cores

```
--primary:    #6C5CE7  (violeta)      ← marca, CTAs
--secondary:  #00CEC9  (teal)         ← badges, tags
--accent:     #FDCB6E  (amber)        ← featured, premium
--background: #FAFAFA  (off-white)    ← fundo
--foreground: #2D3436  (dark gray)    ← texto
--muted:      #B2BEC3  (medium gray)  ← texto secundário
--border:     #DFE6E9  (light gray)   ← bordas
--success:    #00B894  (green)        ← planos, check
--error:      #D63031  (red)          ← erros
--warning:    #F39C12  (orange)       ← alertas
```

### Tipografia

- **Font:** Inter (sans-serif) — carregada via next/font
- **Headings:** Inter Bold/ExtraBold
- **Body:** Inter Regular 16px
- **Monospace:** JetBrains Mono (para exibir prompts)
- **Scale:** 12/14/16/18/20/24/30/36/48/60

### Componentes shadcn/ui Planejados

```
ui/
├── button.tsx          ← primário, secundário, outline, ghost
├── input.tsx           ← todos os inputs
├── textarea.tsx        ← editor de prompts
├── select.tsx          ← filtros de busca
├── badge.tsx           ← badges (categoria, modelo, preço)
├── card.tsx            ← cards de prompt
├── dialog.tsx          ← modais
├── sheet.tsx           ← sidebar mobile
├── tabs.tsx            ← categorias
├── command.tsx         ← search omnibox
├── dropdown-menu.tsx   ← user menu
├── table.tsx           ← admin dashboard
├── avatar.tsx          ← user avatar
├── skeleton.tsx        ← loading states
├── toast.tsx           ← notificações
├── pagination.tsx      ← paginação
└── tooltip.tsx         ← dicas
```

### Layout Principal

```
┌────────────────────────────────────────────────┐
│  HEADER: Logo | Busca global | Categorias |   │
│         [Idioma] [Entrar] [Assinar]            │
├──────────────────┬─────────────────────────────┤
│  SIDEBAR         │  MAIN CONTENT               │
│  (desktop)       │                             │
│                  │  Breadcrumb                  │
│  Categorias      │                             │
│  ├─ Marketing    │  ┌─ Featured Prompts ──────┐│
│  ├─ Code         │  │  Card  | Card  | Card   ││
│  ├─ Design       │  └────────────────────────┘│
│  ├─ Educação     │                             │
│  ├─ Business     │  ┌─ Últimos Prompts ───────┐│
│  └─ ...          │  │  Lista com filtros       ││
│                  │  │  + paginação             ││
│  Filtros         │  └────────────────────────┘│
│  ├─ Modelo AI    │                             │
│  ├─ Preço        │  ┌─ AdSense Banner ────────┐│
│  ├─ Idioma       │  │  [anúncio]               ││
│  └─ Avaliação    │  └────────────────────────┘│
│                  │                             │
│  [AdSense]       │                             │
└──────────────────┴─────────────────────────────┘
┌────────────────────────────────────────────────┐
│  FOOTER: Links | Redes | Termos | © 2026      │
└────────────────────────────────────────────────┘
```

### Página do Prompt

```
┌────────────────────────────────────────────────┐
│  ← Voltar para resultados                      │
│                                                 │
│  📝 Título do Prompt                     ★ 4.8  │
│  Descrição curta do que o prompt faz           │
│                                                 │
│  Badges: [Marketing] [ChatGPT] [Grátis] [PT]   │
│           [234 downloads] [1.2k visualizações] │
│                                                 │
│  ┌────────────────────────────────────────────┐ │
│  │  Você é um especialista em marketing...    │ │
│  │                                            │ │
│  │  [variáveis: {{produto}}, {{publico}}]     │ │
│  │                                            │ │
│  │  [📋 Copiar] [📄 PDF] [📝 MD]             │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  ┌────────────────────────────────────────────┐ │
│  │  [Anúncio AdSense]                         │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  Tags: #seo #copywriting #blog #vendas          │
│                                                 │
│  Avaliações (12)                                │
│  ┌────────────────────────────────────────────┐ │
│  │  ★★★★★ "Funciona muito bem para..."       │ │
│  │  ★★★★  "Bom, mas precisei ajustar..."     │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  Prompts Relacionados                           │
│  ┌──────┐ ┌──────┐ ┌──────┐                    │
│  │ Card │ │ Card │ │ Card │                    │
│  └──────┘ └──────┘ └──────┘                    │
└────────────────────────────────────────────────┘
```

---

## 9. Fases de Desenvolvimento

### 📅 Cronograma (14 semanas — 3.5 meses)

```
Semana 1-3    ─── FASE 1: Fundação
  ├── Setup do monorepo (Turborepo + pnpm)
  ├── Next.js 15 + Tailwind 4 + shadcn/ui
  ├── Drizzle + Supabase (schema, migrations, seeds)
  ├── tRPC + Zod setup
  ├── Auth (Supabase Auth)
  ├── Landing Page (hero, busca, categorias)
  ├── Página de busca com filtros
  ├── Página do prompt com copy
  ├── Admin CRUD de prompts
  └── CI/CD (GitHub Actions + Vercel)
  ┌─────────────────────────┐
  │  ✅ Deploy: Buscável    │
  │  ✅ Copiar prompts      │
  │  ✅ Anúncios AdSense    │
  └─────────────────────────┘

Semana 4-6    ─── FASE 2: Downloads & Coleções
  ├── Geração de PDF (react-pdf ou puppeteer)
  ├── Exportação MD
  ├── Copy com 1 clique + toast
  ├── Coleções pessoais CRUD
  ├── Histórico de downloads
  ├── Ratings e reviews
  └── Testes de integração (download, copy)
  ┌─────────────────────────┐
  │  ✅ Download PDF/MD     │
  │  ✅ Coleções pessoais   │
  │  ✅ Avaliações          │
  └─────────────────────────┘

Semana 7-9    ─── FASE 3: Monetização
  ├── Stripe checkout (Pro + Team)
  ├── Planos e limites (enforced via Drizzle + RLS)
  ├── Stripe webhooks
  ├── Upgrade/downgrade automático
  ├── Pro = sem ads + downloads ilimitados
  ├── Página de preços
  └── Testes E2E (checkout completo)
  ┌─────────────────────────┐
  │  ✅ Stripe ativo        │
  │  ✅ Planos funcionando  │
  └─────────────────────────┘

Semana 10-12  ─── FASE 4: Marketplace
  ├── Cadastro de criadores
  ├── Stripe Connect (payout)
  ├── Página do criador
  ├── Venda avulsa de prompts
  ├── Split automático (70/30)
  └── Moderação de conteúdo
  ┌─────────────────────────┐
  │  ✅ Marketplace ativo   │
  │  ✅ Criadores pagos     │
  └─────────────────────────┘

Semana 13-14  ─── FASE 5: Analytics & Polimento
  ├── PostHog events
  ├── Dashboard admin
  ├── SEO: sitemap, meta, structured data
  ├── i18n: PT-BR + EN-US + EN-GB
  ├── Performance (Lighthouse 90+)
  ├── PWA / Offline support (opcional)
  └── Testes E2E finais + correções
  ┌─────────────────────────┐
  │  ✅ Analytics rodando   │
  │  ✅ SEO otimizado       │
  │  ✅ Multi-idioma        │
  └─────────────────────────┘
```

---

## 10. Estratégia de Testes

### Pirâmide

```
        🎭 E2E (15%)
       ┌─────────────────────────┐
       │ Playwright              │
       │ Fluxos:                 │
       │ • Auth completo         │
       │ • Busca + filtros       │
       │ • Copy + Download       │
       │ • Checkout Stripe       │
       │ • Admin CRUD            │
       └─────────────────────────┘
        ⚛️ Integration (35%)
       ┌──────────────────────────┐
       │ Vitest + MSW             │
       │ • tRPC procedures        │
       │ • Drizzle queries        │
       │ • Stripe webhooks        │
       │ • Download generation    │
       │ • Rate limiting (Redis)  │
       └──────────────────────────┘
        🔬 Unit (50%)
       ┌──────────────────────────┐
       │ Vitest + RTL             │
       │ • Components individuais │
       │ • Utils / helpers        │
       │ • Validações Zod         │
       │ • Formatação de prompt   │
       │ • Geração de PDF/MD      │
       └──────────────────────────┘
```

### O que Testar no MVP

| Categoria | O que testar |
|-----------|-------------|
| **Auth** | Registro (email + Google), login, logout, sessão expirada, Magic Link |
| **Busca** | Full-text search, filtros (categoria, modelo, idioma, preço), paginação |
| **Prompt** | Visualizar, copiar, download PDF, download MD, rating, variáveis |
| **Coleções** | CRUD de coleções, adicionar/remover prompts, coleções privadas |
| **Planos** | Limites Free vs Pro, upgrade, downgrade, cancelamento |
| **Checkout** | Stripe checkout, webhooks, confirmação, invoice |
| **Admin** | CRUD de prompts, gerenciar categorias, ver analytics |
| **Marketplace** | Criador cadastro, venda, split, payout Stripe Connect |
| **Multi-idioma** | i18n PT/EN, conteúdo filtrado por idioma |

### Meta de Cobertura

- **80%+** linhas de código testadas (Vitest coverage)
- **100%** dos fluxos críticos cobertos por E2E
- **≥90%** dos componentes com testes de unidade

---

## 11. CI/CD & Deploy

### GitHub Actions

```yaml
name: PromptHub CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Lint & TypeCheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    name: Unit & Integration Tests
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:ci
      - uses: codecov/codecov-action@v4

  e2e:
    name: E2E Tests
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: pnpm test:e2e

  deploy:
    name: Deploy to Vercel
    needs: [quality, test, e2e]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Deploy Pipeline

```
PR → GitHub: lint, typecheck, test, build
       ↓ (approve)
Preview Deploy (Vercel) → QA
       ↓ (merge)
main branch → GitHub: lint, typecheck, test, build, e2e
       ↓
Production Deploy (Vercel)
       ↓
Sentry Release + PostHog Deploy event
       ↓
Stripe Webhooks sincronizados
```

### Infrastructure as Code

```
├── supabase/
│   ├── config.toml          ← Supabase config
│   ├── migrations/          ← Drizzle migrations
│   └── seed.sql             ← Seeds de desenvolvimento
├── .github/
│   └── workflows/
│       ├── ci.yml           ← CI completo
│       └── deploy.yml       ← Deploy production
├── vercel.json              ← Vercel config
└── docker-compose.yml       ← Desenvolvimento local
```

---

## 12. Estrutura de Diretórios

```
prompthub/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (home)/
│       │   │   └── page.tsx                ← Landing page
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx
│       │   │   ├── cadastro/page.tsx
│       │   │   └── callback/route.ts       ← Supabase callback
│       │   ├── busca/
│       │   │   └── page.tsx                ← Busca + filtros
│       │   ├── prompt/
│       │   │   └── [slug]/
│       │   │       └── page.tsx            ← Página do prompt
│       │   ├── colecoes/
│       │   │   ├── page.tsx
│       │   │   └── [id]/
│       │   │       └── page.tsx
│       │   ├── criadores/
│       │   │   ├── page.tsx
│       │   │   └── [username]/
│       │   │       └── page.tsx
│       │   ├── preco/
│       │   │   └── page.tsx                ← Planos
│       │   ├── admin/
│       │   │   ├── page.tsx                ← Dashboard
│       │   │   ├── prompts/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── novo/page.tsx
│       │   │   │   └── [id]/edit/page.tsx
│       │   │   ├── categorias/
│       │   │   │   └── page.tsx
│       │   │   ├── usuarios/
│       │   │   │   └── page.tsx
│       │   │   └── analytics/
│       │   │       └── page.tsx
│       │   ├── api/
│       │   │   ├── trpc/
│       │   │   │   └── [trpc]/
│       │   │   │       └── route.ts         ← tRPC HTTP handler
│       │   │   ├── webhooks/
│       │   │   │   ├── stripe/route.ts
│       │   │   │   └── supabase/route.ts
│       │   │   ├── download/
│       │   │   │   └── [format]/
│       │   │   │       └── [promptId]/route.ts
│       │   │   └── copy/
│       │   │       └── [promptId]/route.ts
│       │   └── layout.tsx
│       ├── components/
│       │   ├── ui/                         ← shadcn/ui components
│       │   ├── layout/
│       │   │   ├── header.tsx
│       │   │   ├── footer.tsx
│       │   │   └── sidebar.tsx
│       │   ├── prompts/
│       │   │   ├── prompt-card.tsx
│       │   │   ├── prompt-viewer.tsx
│       │   │   ├── prompt-editor.tsx        ← Admin
│       │   │   └── download-buttons.tsx
│       │   ├── search/
│       │   │   ├── search-bar.tsx
│       │   │   ├── search-filters.tsx
│       │   │   └── search-results.tsx
│       │   ├── ads/
│       │   │   ├── ad-banner.tsx
│       │   │   └── ad-native.tsx
│       │   ├── pricing/
│       │   │   ├── pricing-card.tsx
│       │   │   └── pricing-table.tsx
│       │   └── shared/
│       │       ├── locale-switcher.tsx
│       │       ├── theme-toggle.tsx
│       │       └── loading.tsx
│       ├── features/
│       │   ├── auth/
│       │   │   ├── use-auth.ts
│       │   │   └── auth-guard.tsx
│       │   ├── collections/
│       │   │   └── use-collections.ts
│       │   ├── download/
│       │   │   └── use-download.ts
│       │   └── payment/
│       │       └── use-checkout.ts
│       ├── lib/
│       │   ├── trpc/
│       │   │   ├── client.ts
│       │   │   └── server.ts
│       │   ├── drizzle/
│       │   │   └── client.ts
│       │   ├── stripe/
│       │   │   └── client.ts
│       │   ├── redis.ts
│       │   ├── posthog.ts
│       │   └── sentry.ts
│       ├── styles/
│       │   └── globals.css
│       ├── messages/                       ← i18n
│       │   ├── pt-BR.json
│       │   ├── en-US.json
│       │   └── en-GB.json
│       ├── __tests__/
│       │   ├── components/
│       │   ├── features/
│       │   └── utils/
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       ├── vitest.config.ts
│       └── playwright.config.ts
├── packages/
│   ├── database/
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── index.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── prompts.ts
│   │   │   │   ├── categories.ts
│   │   │   │   ├── collections.ts
│   │   │   │   ├── downloads.ts
│   │   │   │   ├── reviews.ts
│   │   │   │   ├── creators.ts
│   │   │   │   ├── sales.ts
│   │   │   │   └── subscriptions.ts
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   │       └── index.ts
│   │   ├── drizzle.config.ts
│   │   └── tsconfig.json
│   ├── shared/                             ← Tipos + validações compartilhadas
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── prompt.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── plan.ts
│   │   │   │   └── api.ts
│   │   │   └── validations/
│   │   │       ├── prompt.ts
│   │   │       ├── auth.ts
│   │   │       └── payment.ts
│   │   └── tsconfig.json
│   ├── stripe/                             ← Stripe helpers
│   │   └── src/
│   │       ├── checkout.ts
│   │       ├── webhooks.ts
│   │       └── connect.ts
│   └── email/                              ← Email templates
│       └── src/
│           ├── welcome.tsx
│           └── payment-confirmed.tsx
├── tools/
│   ├── seed.ts                             ← Popula banco com prompts
│   ├── import-prompts.ts                   ← Import CSV/JSON
│   └── generate-sitemap.ts                 ← Gera sitemap.xml
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json
└── README.md
```

---

## 13. Scripts do Projeto

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "start": "turbo start",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "test:ci": "turbo test:ci",
    "test:e2e": "turbo test:e2e",
    "test:e2e:ui": "turbo test:e2e:ui",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx tools/seed.ts",
    "db:studio": "drizzle-kit studio",
    "format": "prettier --write .",
    "lint:fix": "eslint --fix .",
    "storybook": "storybook dev",
    "storybook:build": "storybook build",
    "sitemap": "tsx tools/generate-sitemap.ts",
    "import": "tsx tools/import-prompts.ts"
  }
}
```

---

## 14. Considerações Técnicas Importantes

### SEO Internacional (hreflang)
```html
<link rel="alternate" href="https://prompthub.com/pt" hreflang="pt-BR" />
<link rel="alternate" href="https://prompthub.com/en" hreflang="en-US" />
<link rel="alternate" href="https://prompthub.com/en-gb" hreflang="en-GB" />
<link rel="alternate" href="https://prompthub.com/en" hreflang="x-default" />
```

### Rate Limiting (Upstash Redis)
```typescript
// API: 100 requests/min por user (free)
// API: 1000 requests/min por user (pro)
// Download: 10 downloads/dia (free)
// Download: ilimitado (pro)
```

### RLS Policies (Supabase)
```sql
-- Prompts grátis: qualquer um vê
-- Prompts pagos: só quem comprou ou tem Pro
-- Coleções: só o dono vê (se privada)
-- Admin: só role='admin' pode CRUD
```

### CDN & Cache
- **Vercel Edge Network** — cache global
- **Upstash Redis** — cache de queries frequentes (categorias, prompts populares)
- **SWR (stale-while-revalidate)** — TanStack Query com cache persistente
- **next/image** — imagens otimizadas

### Performance Targets (Lighthouse)
- **Desktop:** 95+ performance, 100 acessibilidade, 100 SEO
- **Mobile:** 85+ performance, 100 acessibilidade, 100 SEO
- **Core Web Vitals:** Green em todos

---

## 15. Próximos Passos Imediatos

1. ~~Definir conceito do produto~~ ✅
2. ~~Pesquisar concorrência~~ ✅
3. ~~Criar este documento~~ ✅
4. **Inicializar monorepo** (Turborepo + pnpm)
5. **Configurar Next.js 15 + Tailwind + shadcn/ui**
6. **Configurar Drizzle + Supabase** (schema + migrations)
7. **Configurar tRPC + Zod**
8. **Configurar CI/CD** (GitHub Actions + Vercel)
9. **Desenvolver Fase 1 — Fundação**
10. **Deploy da primeira versão**

---

> **PromptHub** — Sua biblioteca inteligente de prompts de IA.
> Brasil • EUA • Reino Unido — 2026
