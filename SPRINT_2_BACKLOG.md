# Sprint 2 Backlog - Foundation Production Ready 🔴

**Objetivo da Sprint:** Substituir todos os mocks por implementações reais e garantir que a base do sistema esteja pronta para produção. Nenhuma nova funcionalidade será criada até que todos os critérios de produção (DoD e Segurança) sejam atendidos.

---

## Épico 1: Billing (Prioridade Máxima)
**Resultado Esperado:** Nenhum usuário consegue usar recursos além do contratado.

### Story 1.1: Integração Completa com Stripe
**Tasks:**
- [ ] Configurar chaves do Stripe no ambiente.
- [ ] Criar rotas de API para Checkout Session.
- [ ] Criar portal do cliente (Customer Portal).
- [ ] Implementar e sincronizar Webhooks (pagamento confirmado, cancelamento, falha).
**Critérios de Aceite:**
- O usuário deve conseguir assinar um plano via Stripe Checkout.
- O usuário deve conseguir gerenciar a assinatura pelo Portal da Stripe.
- Webhooks do Stripe devem refletir imediatamente o status no banco de dados local.
**Testes:**
- Unitários: Lógica de cálculo de planos e parse de payload do Stripe.
- E2E: Fluxo de assinatura utilizando cartão de teste (Stripe Test Mode).
**Arquivos afetados:**
- `packages/database/src/schema/billing.ts` (ou equivalente)
- `apps/api/src/routes/stripe.ts`
- `packages/core/src/billing/stripe-client.ts`
**Estimativa:** 8h

### Story 1.2: Controle de Créditos e Bloqueio por Plano
**Tasks:**
- [ ] Implementar middleware/verificador de créditos vinculado ao tenant (organização).
- [ ] Bloquear execuções de automação se os créditos forem `<= 0` ou se o plano for inadequado para a ação.
- [ ] Abater créditos a cada execução de node/workflow (Garantindo atomicidade no DB).
- [ ] Upgrade/Downgrade de planos reflete no limite de créditos/recursos no próximo ciclo.
**Critérios de Aceite:**
- Usuários sem créditos ou com plano bloqueado recebem erro amigável na UI e `402 Payment Required` na API.
- O abatimento de créditos deve ser atômico (evitar race conditions).
**Testes:**
- Unitários: Testar bloqueio com saldo zero. Testes de atomicidade em concorrência.
**Arquivos afetados:**
- `packages/core/src/billing/credit-manager.ts`
- `apps/api/src/middlewares/require-credits.ts`
- `apps/api/src/routes/workflows.ts`
**Estimativa:** 8h

---

## Épico 2: Credential Manager
**Resultado Esperado:** Sistema centralizado e seguro para gestão de credenciais de terceiros.

### Story 2.1: Sistema OAuth Centralizado e Seguro
**Tasks:**
- [ ] Criar schema de banco para armazenar tokens.
- [ ] Implementar módulo de criptografia robusta para acesso e salvamento de tokens.
- [ ] Implementar fluxo de autorização genérico (callback OAuth).
- [ ] Implementar rotação e renovação automática (Refresh Token).
- [ ] Adicionar suporte aos provedores: Google, Slack, Discord, Notion, GitHub, OpenAI.
**Critérios de Aceite:**
- Tokens no BD devem estar rigorosamente criptografados (criptografia at-rest ou via lógica na aplicação).
- A API deve interceptar e usar o Refresh Token silenciosamente caso o Access Token tenha expirado.
**Testes:**
- Unitários: Criptografia e descriptografia garantindo que dados plain text nunca vazem.
- E2E: Simulação de fluxo OAuth completo com mock dos provedores externos.
**Arquivos afetados:**
- `packages/database/src/schema/credentials.ts`
- `apps/api/src/routes/oauth.ts`
- `packages/core/src/security/encryption.ts`
- `packages/core/src/credentials/token-manager.ts`
**Estimativa:** 16h

---

## Épico 3: Primeiras Integrações Reais
**Resultado Esperado:** Automações reais substituindo os nós mockados.

### Story 3.1: Implementação dos Nós (Nodes) Core
**Tasks:**
- [ ] Implementar Node Gmail (Autenticação OAuth e Envio de email).
- [ ] Implementar Node Google Sheets (Autenticação OAuth, Leitura e Escrita de linhas).
- [ ] Implementar Node OpenAI (Geração de texto usando a API Real).
- [ ] Implementar Node HTTP Request (Fetch customizado com proxy ou controle de timeout).
- [ ] Implementar Node Webhook (Gatilho de entrada real).
- [ ] Implementar Node Slack (Autenticação OAuth, Envio de mensagem em canal).
**Critérios de Aceite:**
- Todos os nós devem executar as ações reais na internet usando as credenciais do Credential Manager.
- Todos os mocks antigos devem ser removidos do projeto.
**Testes:**
- Unitários: Comportamento esperado da classe Node.
- E2E/Integração: Testar conexões reais (usando chaves de staging/sandboxes das APIs).
**Arquivos afetados:**
- `packages/core/src/nodes/gmail.ts`
- `packages/core/src/nodes/google-sheets.ts`
- `packages/core/src/nodes/openai.ts`
- `packages/core/src/nodes/http.ts`
- `packages/core/src/nodes/webhook.ts`
- `packages/core/src/nodes/slack.ts`
**Estimativa:** 24h

---

## Épico 4: Segurança
**Resultado Esperado:** Aplicação rigorosa das diretrizes do `SECURITY_ARCHITECTURE.md`.

### Story 4.1: Aplicação de Proteções na API e Banco de Dados
**Tasks:**
- [ ] Configurar WAF (Web Application Firewall) (Configuração de provedor, ex: Cloudflare/Vercel).
- [ ] Implementar Rate Limiting global e por rota (ex: Upstash/Redis).
- [ ] Configurar módulo de auditoria (Auditoria de ações do usuário - Log Trail).
- [ ] Validação rigorosa e sanitização de todos os inputs (utilizando Zod em todas as rotas).
- [ ] Habilitar Row Level Security (RLS) no banco de dados (Supabase) garantindo isolamento B2B.
**Critérios de Aceite:**
- Requisições abusivas ou de brute-force devem retornar `429 Too Many Requests`.
- Ações sensíveis e destrutivas ficam registradas em tabela de auditoria.
- Tenant A não consegue, sob nenhuma hipótese, ler ou modificar dados do Tenant B (garantido no RLS).
**Testes:**
- Testes de Integração focados em segurança (tentar acessar recursos de outro Tenant).
- Testes de Rate Limiting e Injection.
**Arquivos afetados:**
- `apps/api/src/middlewares/rate-limit.ts`
- `apps/api/src/middlewares/validation.ts`
- `supabase/migrations/*_rls.sql`
- `packages/database/src/schema/audit.ts`
**Estimativa:** 16h

---

## Épico 5: Observabilidade
**Resultado Esperado:** Ferramental de monitoramento para garantir diagnósticos em produção.

### Story 5.1: Logs, Sentry e OpenTelemetry
**Tasks:**
- [ ] Integrar Sentry para captura de exceções em todos os serviços (Frontend, API, Engine/Workers).
- [ ] Instrumentar rotas principais e execução de Engine com OpenTelemetry.
- [ ] Criar logger unificado (Winston/Pino) para salvar outputs estruturados em JSON.
- [ ] Configurar Dashboard básico de erros ou alertas no Discord/Slack interno.
**Critérios de Aceite:**
- Qualquer exceção não tratada na API ou nos Workers deve abrir uma issue no Sentry imediatamente.
- Cada requisição e execução de workflow na Engine deve possuir um `Trace ID` único para rastreabilidade cruzada.
**Testes:**
- Mock de erros fatais (Error 500) para confirmar emissão de log estruturado e envio ao Sentry.
**Arquivos afetados:**
- `apps/api/src/index.ts`
- `apps/web/src/pages/_app.tsx`
- `packages/core/src/logger.ts`
- `packages/core/src/engine.ts`
**Estimativa:** 8h

---

## Épico 6: Testes
**Resultado Esperado:** Cobertura satisfatória e garantia de confiabilidade antes de expor aos clientes reais.

### Story 6.1: Aumento de Cobertura e Fluxos E2E
**Tasks:**
- [ ] Configurar setup de testes unificado para Jest/Vitest em todo o monorepo.
- [ ] Atingir cobertura mínima de 80% nos pacotes `core` e `database`.
- [ ] Escrever testes E2E (com Playwright ou Cypress) para: Fluxo de autenticação e Criação/Execução de um Workflow básico.
- [ ] Criar suíte de testes isolada apenas para o comportamento da Engine.
**Critérios de Aceite:**
- O pipeline de CI no GitHub Actions deve ser configurado para falhar se a cobertura cair abaixo de 80%.
- A funcionalidade principal do app (criar automação, conectar integrações e rodar) deve estar coberta pelo E2E sem intervenção manual.
**Testes:**
- Toda a suíte deve rodar de ponta a ponta sem erros intermitentes ("flaky tests").
**Arquivos afetados:**
- `packages/core/**/*.spec.ts`
- `packages/database/**/*.spec.ts`
- `apps/web/tests/e2e/workflow.spec.ts`
- `.github/workflows/ci.yml`
**Estimativa:** 24h
