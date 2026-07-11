# Sprint 5 Backlog - IA Employees (Agentes Autônomos) 🤖💼

**Objetivo da Sprint:** Evoluir a plataforma de uma simples ferramenta de automação (IFTTT/Zapier) para uma agência de Funcionários de IA. O sistema permitirá a criação, instalação e orquestração de pacotes de workflows que funcionam em conjunto (ex: Um Agente de Suporte e um Agente SDR).

---

## Épico 1: Estrutura de Agentes no Banco de Dados (B2B)
**Resultado Esperado:** Agentes passam a ter dono corporativo (Organização) e conseguem abrigar múltiplos workflows simultaneamente.

### Story 1.1: Relacionamento Agent -> Workflows
**Tasks:**
- [ ] Adicionar `organizationId` na tabela `agents.ts` para conformidade B2B.
- [ ] Criar tabela pivô `agent_workflows` para relacionar um Agente a múltiplos Workflows (O cérebro do funcionário é composto por várias automações).
- [ ] Criar endpoint `/api/agents` para CRUD de Agentes por organização.
**Critérios de Aceite:**
- Um agente só pode pertencer a uma organização.
- Um agente pode disparar múltiplos workflows associados a ele.
**Arquivos afetados:**
- `packages/database/src/schema/agents.ts`
- `packages/database/src/schema/agent_workflows.ts`
**Estimativa:** 12h

---

## Épico 2: Instalação de "Pacotes de Funcionários" (Marketplace Bundle)
**Resultado Esperado:** O usuário clica em "Contratar AI SDR" e a plataforma clona e configura 3 workflows na conta dele simultaneamente.

### Story 2.1: Bundle Installer
**Tasks:**
- [ ] Adaptar o `InstallService` da Sprint 3 para suportar a instalação de um Agente.
- [ ] Quando um Agente for instalado da vitrine pública, todos os workflows atrelados a ele devem ser "Forks" automáticos e vinculados ao Agente local do cliente.
**Critérios de Aceite:**
- Apenas 1 clique deve ser necessário para baixar o Agente e todos os seus Workflows dependentes.
**Arquivos afetados:**
- `packages/shared/src/marketplace/install-service.ts`
- `apps/web/app/api/marketplace/agents/install/[id]/route.ts`
**Estimativa:** 16h

---

## Épico 3: Execução Orientada a Agente
**Resultado Esperado:** Dashboards e logs passam a reportar o desempenho de cada "Funcionário", não apenas de workflows isolados.

### Story 3.1: Identidade do Agente nas Execuções
**Tasks:**
- [ ] Adicionar `agentId` opcional na tabela `executions` ou `usage_logs`.
- [ ] Sempre que um workflow for executado e pertencer a um Agente, herdar a identidade dele no log.
**Estimativa:** 8h
