# Sprint 6 Backlog - Analytics & Observabilidade 📊

**Objetivo da Sprint:** Fornecer à empresa (Organização) métricas tangíveis do valor que a plataforma entrega. Em vez de apenas mostrar "Você rodou X integrações", queremos mostrar "Você salvou Y horas e economizou Z reais".

---

## Épico 1: Métricas de Valor do Workflow (ROI)
**Resultado Esperado:** Cada workflow deve permitir que o autor defina "Quanto tempo essa tarefa demorava quando feita manualmente?".

### Story 1.1: Campos de ROI no Banco de Dados
**Tasks:**
- [ ] Adicionar na tabela `workflows` colunas para estimativa de ROI: `estimatedTimeSavedMs` (tempo economizado por execução) e `estimatedCostSavedCents` (custo manual evitado).
- [ ] Opcionalmente estender para `agents` se aplicável.
**Critérios de Aceite:**
- Apenas o criador da automação ou o admin pode definir essas métricas (padrão pode ser, por exemplo, 5 minutos por execução).
**Arquivos afetados:**
- `packages/database/src/schema/workflows.ts`
**Estimativa:** 4h

---

## Épico 2: Motor de Agregação (Dashboard API)
**Resultado Esperado:** Um endpoint que resume todo o impacto da organização agrupado por período.

### Story 2.1: Agregação de Execuções e Horas Salvas
**Tasks:**
- [ ] Criar `/api/analytics/impact/route.ts`.
- [ ] Fazer queries no Drizzle usando `sum()` e agrupamentos para cruzar as `executions` bem-sucedidas com os metadados do `workflow` atrelado (tempo e custo salvo).
- [ ] Somar o volume de execuções com erro vs sucesso.
**Critérios de Aceite:**
- Deve retornar `totalHoursSaved`, `totalMoneySaved`, `successRate`, `totalExecutions`.
- Isolamento rígido: a query só pode ler as execuções e workflows cujo `organizationId` pertença ao usuário logado.
**Arquivos afetados:**
- `apps/web/app/api/analytics/impact/route.ts`
**Estimativa:** 16h
