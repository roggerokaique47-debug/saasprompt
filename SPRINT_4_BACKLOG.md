# Sprint 4 Backlog - AI Workflows & Copilot 🤖

**Objetivo da Sprint:** Elevar o nível da ferramenta trazendo Inteligência Artificial Generativa para dentro do editor. Usuários deverão poder gerar automações digitando linguagem natural, receber validações em tempo real do "Copilot" e visualizar estimativas de custos de tokens das execuções.

---

## Épico 1: Geração Generativa de Workflows (Text-to-Workflow)
**Resultado Esperado:** O usuário descreve o que deseja e a plataforma devolve o Canvas montado com os nós.

### Story 1.1: Endpoint de Text-to-Workflow
**Tasks:**
- [ ] Integrar `ai` (Vercel AI SDK) e `@ai-sdk/openai` ao pacote `@prompthub/shared` (ou novo pacote `@prompthub/ai`).
- [ ] Criar endpoint genérico `POST /api/ai/generate-workflow`.
- [ ] Escrever o System Prompt com regras restritas para devolver o JSON estruturado (`workflowJson`) com base na estrutura de nós já existente na plataforma (Webhook, Gmail, Slack, etc.).
- [ ] Usar `generateObject` do Vercel AI SDK com esquema Zod para forçar a formatação estrita do JSON.
**Critérios de Aceite:**
- Apenas usuários com créditos suficientes ou plano Pro/Enterprise podem usar o gerador.
- O JSON devolvido pela IA não deve conter lixo ou nós inexistentes.
**Arquivos afetados:**
- `packages/shared/src/ai/workflow-generator.ts`
- `apps/web/app/api/ai/generate-workflow/route.ts`
**Estimativa:** 16h

---

## Épico 2: Workflow Copilot
**Resultado Esperado:** Um assistente que valida os passos criados pelo usuário e previne erros comuns de lógica (como laços infinitos ou nós sem credencial).

### Story 2.1: Validação de Lógica em Tempo Real
**Tasks:**
- [ ] Criar classe ou serviço de validação estática de JSON (`packages/engine/src/validator.ts`).
- [ ] Detectar nós que precisam de autenticação mas a configuração está vazia.
- [ ] Detectar ciclos (referências circulares) que possam causar execuções infinitas.
**Critérios de Aceite:**
- Antes de salvar ou de publicar, o Copilot intercepta e avisa o usuário dos erros lógicos.
**Testes:**
- Teste unitário para deteção de ciclos de grafos.
**Estimativa:** 8h

---

## Épico 3: Transparência e Estimativa de Custos
**Resultado Esperado:** O usuário consegue ver quantos tokens (e consequentemente créditos) uma automação pode consumir.

### Story 3.1: Token Calculator
**Tasks:**
- [ ] Mapear o custo em Tokens por Nó (ex: nó do ChatGPT 4o é dinâmico, nó do Webhook custa 1 crédito).
- [ ] Criar função de estimativa estática baseada no número de nós.
- [ ] Ao terminar uma execução real (Worker), gravar em `usage_logs` a quantidade real de créditos queimados, conectando a dedução do Épico 1 (Billing) com os relatórios de uso.
**Critérios de Aceite:**
- A execução do modelo de IA (OpenAI, Claude) deve registrar a contagem de tokens (in/out) e debitar no banco via a transação já existente.
**Arquivos afetados:**
- `packages/engine/src/executor.ts` (ou equivalente que roda a máquina de estados)
**Estimativa:** 16h
