# CHANGELOG (11_CHANGELOG.md)

Todas as mudanças notáveis do projeto são documentadas aqui em formato SemVer.

---

## [1.0.0] - 2026-07-11 (Atual)
### Adicionado
- **Sprint 11 — Migração B2B Completa:** Todas as rotas de API, logs de execução, feedbacks e leads migrados de `userId` para `organizationId`. Criação automática de Organização pessoal no OAuth callback. Admin UI corrigida com `leftJoin` em `organizations`.
- **Sprint 5 — AI Employees Bundle Installer:** CRUD completo de Agentes (PATCH/DELETE com Zero Trust), `agent_workflows` pivot com cascata manual, Marketplace Bundle Installer que clona o Agente + todos os Workflows vinculados em 1 clique sanitizando credenciais.
- **Identidade de Execução por Agente:** `agentId` opcional propagado nos registros de `executions` via `/api/workflows/execute`, `/api/webhooks/[workflowId]` e `ExecutionContext` do engine.
- **Analytics de Agentes:** `/api/analytics/agents` retorna métricas de performance por Funcionário de IA (runs, horas salvas).

### Alterado
- `packages/nodes/src/types.ts`: `ExecutionContext` agora suporta `agentId?: string`.
- Motor de Execução, Nodes e Workers blindados via RLS e `organizationId`; parâmetros `Promise<>` corrigidos para Next.js 15.


---

## [0.2.0] - 2026-07-10
### Adicionado
- **Realtime Execution Logs:** Acompanhamento ao vivo dos "Steps" na dashboard de Execuções sem Refresh usando Supabase Realtime (WebSockets).
- **Architecture Multi-tenant:** Banco de dados reconstruído com tabelas `organizations` e `members`, e aplicação estrita de Policies (RLS) PostgreSQL.
- **Workflow Versioning:** O Banco não dá overwrite no JSON de fluxos. Salva versões passadas via Tabela `workflow_versions` imutável.
- **Serviço IA Desacoplado:** Prompt-to-Workflow isolado num endpoint de geração limpo `/api/ai/generate-workflow` reconhecendo todos os 20 Nodes nativos.
- **Sistema O.S. do Cérebro da IA:** O Sistema Operacional de Agente criado sob `/docs/ai-memory/` ativado.

### Alterado
- Motor de Execução (`packages/engine`) injeta injeção de dependência completa (`ExecutionContext`) para não saber sobre o Banco ou Nuvem, disparando apenas `onNodeStart` e `onNodeComplete`.

---

## [0.1.0] - Alpha
### Adicionado
- Fundação Turborepo.
- Nodes de Base (20 tipos listados no Manifest).
- Editor Drag and Drop com Zustand/React Flow.
- Login inicial.
