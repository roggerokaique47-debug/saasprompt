# MASTER_PROJECT_CONTEXT.md

*Última Atualização: 10 de Julho de 2026*

Este documento serve como o "cérebro" do projeto **NovaFlow AI** (referenciado internamente no código como `prompthub`). Ele contém todo o contexto, arquitetura, decisões técnicas e estado atual do ecossistema para alinhar novos desenvolvedores, agentes de IA e a gerência de engenharia.

---

## 1. Visão Geral do Sistema e Objetivos do Produto
O **NovaFlow AI** é uma plataforma SaaS B2B de automação de fluxos de trabalho (Workflow Automation) alimentada por Inteligência Artificial. Ele permite que os usuários criem fluxos visuais via "Drag and Drop" para conectar aplicações externas (como Stripe, WhatsApp, Slack, Gmail, HubSpot) e aplicar lógicas customizadas, filtros e prompts de IA durante o trajeto da informação.

**Objetivo Central:** Concorrer diretamente com n8n, Make e Zapier oferecendo uma experiência premium, rápida e hiper-focada no uso de LLMs fluentes, sem as restrições arquiteturais monolíticas de plataformas antigas.

### 1.1 O Ecossistema brasaCRM (Master Hub)
O NovaFlow **não atua de forma isolada**. Ele é um SaaS satélite que pertence ao ecossistema do **brasaCRM** (O Centro de Comando).
*   **Desacoplamento Rigoroso:** Para não estragarmos o código de outros serviços da suíte e mantermos uma base sólida, o NovaFlow se concentra estritamente na sua regra de negócios (Workflow Automation).
*   **Infraestrutura Centralizada:** DevOps, Observabilidade Global (Grafana/Loki/VictoriaMetrics) e gestão cruzada de clientes (SSO) ficam no lado do brasaCRM. O NovaFlow não deve conter configurações pesadas de orquestração de infraestrutura global (ex: `docker-compose.yml` de monitoramento corporativo) em seu repositório. O foco aqui é exportar métricas limpas (via OpenTelemetry) e expor APIs seguras para que o brasaCRM "pilote" o NovaFlow externamente.

---

## 2. Arquitetura Completa
A plataforma adota uma arquitetura Serverless/Edge moderna, distribuída e Multi-tenant.

- **Client-Side (Browser):** Next.js App Router (React 19) rodando o canvas interativo (`React Flow`). É aqui que a UI acontece.
- **Backend API (Next.js):** Servidor Serverless hospedado na Vercel atuando como *BFF (Backend For Frontend)*. Protegido via Supabase Auth.
- **Orquestração Assíncrona (Queue/Workers):** Para evitar timeout de servidores (limites de 10s a 60s da Vercel), toda a execução de workflow (que pode demorar minutos) é empurrada via API para o **Inngest**.
- **Workers (Inngest):** A infraestrutura do Inngest consome os jobs através do App `workers`. Estes workers disparam a Engine, e salvam os resultados em tempo real no banco via Webhooks internos (`/api/executions/[id]/steps`) usando a Header secreta `x-internal-key`.
- **Banco de Dados (Supabase/PostgreSQL):** A única fonte da verdade (SSOT). Protegido ferrenhamente com Row Level Security (RLS) impedindo vazamento Multi-tenant. Provê WebSockets nativos (Supabase Realtime) para a UI acompanhar logs de Workers sem polling.

---

## 3. Decisões Técnicas Tomadas e Padrões de Código
1. **Monorepo com Turborepo:** Dividimos responsabilidades estritamente. O Frontend (`apps/web`) não sabe como um nó funciona. Ele apenas consome pacotes utilitários e visuais.
   - `packages/engine`: Lógica bruta de parsing de Grafos (Topological Sort) e execução isolada.
   - `packages/nodes`: As definições e "Executors" de cada ação isolada (tipo plugins).
   - `packages/database`: Tudo relacionado a schemas do Drizzle ORM e acessos.
   - `packages/shared`: Tipagens e Utilitários compartilhados (Zod Schemas, Constantes).
2. **Separação de Serviço de IA:** A Inteligência Artificial (geração mágica de workflows a partir de texto) vive separada do motor de execução, no endpoint `/api/ai/generate-workflow`.
3. **Padrão de Dados (Inputs/Outputs):** Na engine, o Output do "Nó A" vira o Input do "Nó B". Se o "Nó B" tem múltiplos parentes (Ex: nó Merge), o input vira um array de outputs anteriores.
4. **Zero Confiança no Frontend:** O banco (Supabase) ignora filtros manuais e impõe politícas de restrição a nível de linha de dados. Tudo orbita em torno de `organization_id` e `user_id`.
5. **Comunicação Worker ↔ Frontend:** Workers usam requisições HTTP seguras (via `x-internal-key`) para se comunicar com o banco de dados. Eles não instanciam ORMs pesados diretamente na borda sem necessidade.

---

## 4. Banco de Dados (PostgreSQL + Drizzle ORM)
O acesso é feito primariamente com **Drizzle ORM**.
Tabelas Críticas (Itens da arquitetura Multi-Tenant e Automação):

- **`organizations` & `members`:** Base do isolamento B2B. Planos de assinaturas e permissões de usuários (RBAC: Admin, Editor, Viewer).
- **`workflows`:** Tabela principal contendo a estrutura macro.
- **`workflow_versions`:** Histórico de versões (append-only) do JSON da tela do React Flow. Garante auditoria ("Quem mudou isso na sexta-feira?").
- **`executions` & `execution_steps`:** O coração da observabilidade. `executions` mostra o Macro (Sucesso/Falha/Tempo Total), enquanto `execution_steps` mostra cada micronó executado (Sucesso/Falha de 1 nó de e-mail), com capacidade de notificar o client via WebSocket (Supabase Realtime).
- **`credentials`:** Tokens criptografados de APIs externas de usuários.
- **`webhook_endpoints`:** URLs customizadas seguras para aceitar Postbacks que disparam fluxos de automação.

---

## 5. Estrutura de Pastas (Visão Macro)
```text
├── apps/
│   ├── web/ (Aplicação Front-End/BFF principal)
│   └── workers/ (Módulo consumido pelo Inngest, cuida da orquestração)
├── packages/
│   ├── database/ (Schemas do Postgres e configurações do Drizzle)
│   ├── engine/ (Core da Engine matemática e executora)
│   ├── nodes/ (Plugins de execução - ex: slack_send, gmail_read)
│   ├── payments/ (Wrapper genérico de pagamentos)
│   ├── shared/ (Zod Validators, Tipos, Utils genéricos)
│   └── stripe/ (Integração oficial com Stripe Billing)
├── supabase/
│   └── functions/ (Edge functions raw do Supabase, se necessário)
```

---

## 6. Motor (Engine) e Executores (Nodes)

**A Engine:** 
Usa ordenação topológica (Topological Sort) para evitar loops e organizar dependências lineares do Grafo (DAG).
Injeta um `ExecutionContext` customizado para garantir injeção de Logs Granulares (`onNodeStart` e `onNodeComplete`) enquanto a execução do Node roda de forma agnóstica na nuvem Inngest.

**Os Nós (`packages/nodes`):**
Cada nó é um miniecossistema (plugin) com sua definição estrita de UI e seu `executor`. Temos cerca de 20 construídos ou em mock estrutural:
*Triggers:* `webhook`, `schedule`
*Ações Core:* `http_request`, `openai`, `code` (JS genérico), `delay`, `filter`, `switch`, `merge`.
*Ações de Terceiros:* Gmail, Google Sheets, WhatsApp, Slack, Discord, Email SMTP, HubSpot, Typeform, Notion.

---

## 7. Componentes React e UI (React Flow)
Construído com `@xyflow/react` e Tailwind (shadcn).
- **`WorkflowEditor`:** O canvas principal.
- **`CustomNode`:** Renderizador central que muda visualmente baseado no type, injetando inputs dinâmicos, ícones e cores conforme o estado em tempo real.
- **`AIGeneratorModal`:** Interface de Mágica IA acoplada com endpoint Serverless.
- **`ExecutionStepsPanel`:** Escuta websockets (postgres_changes) do banco e desenha a barra de progresso (⏳ ✓ ✕) por Nó de forma assíncrona.

---

## 8. APIs
Os principais fluxos Server-side internos localizados no `/apps/web/app/api`:
- **`POST /api/workflows/execute`:** Enfileira o job. Não espera a execução.
- **`POST /api/executions/[id]/steps`:** Rota protegida. O Worker bate aqui para registrar em tempo real o sucesso/erro de um nó na tabela `execution_steps`.
- **`POST /api/ai/generate-workflow`:** Recebe requisições de prompt (Ex: "Faça um bot de Slack que fala com OpenAI") e devolve `nodes` e `edges` para plugar na UI.
- **`POST /api/ai/copilot`:** Sugere o próximo nó baseando-se no grafo atual desenhado em tela.

---

## 9. Autenticação e Deploy
- **Auth:** O projeto usa SSR Authentication (Cookies) gerida pelo SDK `@supabase/ssr`. As Sessões JWT são passadas entre Client-Side e Middlewares Next.js impedindo Flash-Of-Unauthenticated-Content.
- **Deploy:** Configurado sob `turbo` (Turborepo). 
  - Frontend: Vercel (Edge Network e Node 22).
  - Webhooks de Worker: Vercel/Inngest (Configurado para rodar `executeWorkflowFn`).
  - Banco de Dados: Supabase.

---

## 10. Roadmap e Estado das Funcionalidades

### Funcionalidades Prontas (✅)
- [x] Login e Autenticação robusta Supabase.
- [x] Dashboard de gestão de execuções.
- [x] Criador de Workflow Canvas e Salvamento JSON.
- [x] Execução Assíncrona via Worker Inngest (Filas de tolerância a falhas).
- [x] Logs em Tempo Real Granulares via WebSocket (UX 10/10).
- [x] IA Geradora de Fluxos (Text-to-Workflow) e Copilot integrado.
- [x] Banco Multi-tenant (RLS Ativo).

### Funcionalidades Pendentes e Prioridades do Roadmap (❌ e ⚠️)
- **1. APIs Reais nos Nós (Ações de Terceiros):** A infraestrutura dos nós está desenhada, mas a integração OAuth e chaves de API (ex: Slack, WhatsApp, Google Sheets) requerem lógica nos `execute.ts` de cada nó e fluxo de consentimento na interface.
- **2. Segurança Sandbox do Nó `Code`:** Executar JS arbitrário de clientes em cloud Workers é arriscado. Implementar Isolates (V8/QuickJS) ou Workers restritos antes de lançar à produção para evitar quebras de máquina virtual ou leitura de variáveis de ambiente no servidor.
- **3. Billing e Planos (Stripe):** A base existe (`packages/stripe`, `packages/payments`), mas faltam travas lógicas na fila Inngest para barrar Execuções que passaram da Cota Mensal baseada na assinatura.
- **4. Proteção Rate Limiting nos Webhooks:** A tabela `webhook_endpoints` não tem proteção Upstream. É necessário adicionar limitação de chamadas no `route.ts` de triggers webhook para evitar "ataques de DDoS a cotas de cliente".
- **5. Marketplace / Templates Comunitários:** Construção de uma vitrine pública onde usuários podem "Clonar para o meu Workspace" configurações e promts validados.

---

*Use este documento como norte arquitetônico para qualquer agente LLM ou novo Engenheiro Front/Back-end alocado no projeto NovaFlow AI.*
