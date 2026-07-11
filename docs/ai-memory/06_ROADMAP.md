# ROADMAP DE PRODUTO (06_ROADMAP.md)

Atualizado em: 2026-07-11

O que ainda falta para lançarmos em produção plena (v1.0.0):

## Alta Prioridade (P0)
- [x] **Fluxo de Credenciais e OAuth:** Google, Slack, HubSpot OAuth implementados. Tokens criptografados com AES-256-GCM na tabela `credentials` isolada por `organizationId`. (Sprint 9)
- [x] **Integrações Reais (Action Nodes):** Gmail, Sheets, Drive, Slack, HubSpot, Notion, WhatsApp, Discord, Typeform — todos com SDKs reais. (Sprint 9/10)
- [x] **Billing e Créditos (Stripe):** `CreditManager` deduz atomicamente por `organizationId`. Stripe Webhook diferencia checkout vs renovação. (Sprint 9/11)
- [x] **Rate Limit em Webhooks:** `checkRateLimit` via Upstash Redis (100 req/min por workflow/IP). (Sprint 9)

## Média Prioridade (P1)
- [ ] **Node Sandbox Seguro (Code Node):** Isolar execução de código JS do usuário num QuickJS ou vm2. `eval/Function` nativo ainda em uso — BRECHA CRÍTICA antes do Go Live.
- [x] **Marketplace Público / Templates:** `isPublished`, clonagem e `install-service.ts` completos. (Sprint 3/5)
- [x] **Auth UI Completo:** Onboarding, recuperação de senha, Google OAuth e criação automática de Organização pessoal. (Sprint 11)
- [x] **RBAC:** Roles (owner, admin, editor, viewer) e convites de membros. (Sprint 8)

## Baixa Prioridade (P2)
- [ ] Integração com Typeform nativa via OAuth real (atualmente usando API Key).
- [ ] Monitoramento via Sentry para falhas internas do Motor de Execução.
- [ ] Logs Exportáveis (CSV/PDF) das Execuções para Enterprise.
- [ ] **DAG Linting no Editor:** Validar loops circulares e nós não conectados antes de salvar.
