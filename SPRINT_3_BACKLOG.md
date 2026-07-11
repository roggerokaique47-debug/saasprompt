# Sprint 3 Backlog - Marketplace & Templates 🛒

**Objetivo da Sprint:** Transformar a NovaFlow AI em uma plataforma colaborativa e escalável, lançando o Marketplace de Workflows. Usuários poderão descobrir, instalar e até publicar suas próprias automações, criando um ecossistema de templates valiosos.

---

## Épico 1: Catálogo de Templates Públicos (Descoberta)
**Resultado Esperado:** Visitantes e usuários podem navegar, pesquisar e visualizar detalhes de workflows públicos.

### Story 1.1: Vitrine de Workflows (Marketplace Home)
**Tasks:**
- [ ] Criar página `/marketplace` (ou usar a rota `/biblioteca` atual) para exibir workflows marcados como `isPublished = true`.
- [ ] Implementar paginação ou infinity scroll.
- [ ] Implementar sistema de filtros por categoria (`workflow_categories`), preço (Premium vs Free) e ordenação (Mais baixados, Mais recentes, Maior nota).
- [ ] Criar card de template reutilizável (título, autor, ícone da categoria, preço, métricas).
**Critérios de Aceite:**
- Apenas workflows `isPublished = true` devem ser listados.
- Filtros devem ocorrer no backend (SQL) para não sobrecarregar o client.
**Arquivos afetados:**
- `apps/web/app/(public)/marketplace/page.tsx`
- `apps/web/app/api/marketplace/workflows/route.ts`
**Estimativa:** 16h

### Story 1.2: Página de Detalhes do Template
**Tasks:**
- [ ] Criar rota `/marketplace/[slug]` exibindo os detalhes do workflow.
- [ ] Mostrar Readme/descrição detalhada, tags e estatísticas.
- [ ] Renderizar um preview visual do workflow (canvas readonly) utilizando o `workflowJson`.
- [ ] Incrementar contador de `views` toda vez que a página for acessada.
**Critérios de Aceite:**
- O preview visual do workflow deve ocultar dados sensíveis (API keys ou tokens) presentes no JSON.
**Arquivos afetados:**
- `apps/web/app/(public)/marketplace/[slug]/page.tsx`
- `apps/web/components/workflows/WorkflowPreview.tsx`
**Estimativa:** 12h

---

## Épico 2: Instalação e Duplicação (Fork)
**Resultado Esperado:** Com 1 clique, o usuário copia o workflow para seu próprio Workspace.

### Story 2.1: Lógica de Duplicação Segura
**Tasks:**
- [ ] Criar endpoint `POST /api/marketplace/install/:id`.
- [ ] Validar se o template é Premium (se for, verificar se o usuário pagou/possui acesso).
- [ ] Clonar o registro na tabela `workflows`, definindo o `organizationId` do usuário logado.
- [ ] Resetar dados dinâmicos do JSON clonado (id de credenciais, configurações específicas do autor).
- [ ] Incrementar a contagem de `downloads` do template original.
**Critérios de Aceite:**
- O workflow clonado não pode ter nenhuma ligação com o credenciamento do autor original.
- Deve aparecer automaticamente no dashboard do usuário (`/dashboard/workflows`).
**Testes:**
- Unitário: Testar higienização do JSON (remoção de secrets).
**Arquivos afetados:**
- `apps/web/app/api/marketplace/install/[id]/route.ts`
- `packages/core/src/marketplace/install-service.ts`
**Estimativa:** 16h

---

## Épico 3: Publicação e Monetização (Creators)
**Resultado Esperado:** Usuários podem transformar seus workflows em templates e monetizar.

### Story 3.1: Fluxo de Publicação
**Tasks:**
- [ ] Adicionar botão "Publicar no Marketplace" na tela de edição do Workflow.
- [ ] Criar modal de publicação (exigir preenchimento de Descrição, Categoria, Tags e Preço).
- [ ] Endpoint `PATCH /api/workflows/:id/publish` que atualiza `isPublished` e metadados.
**Critérios de Aceite:**
- O workflow só pode ser publicado se for válido (passar no validador do canvas).
- O autor pode retirar do ar (despublicar) a qualquer momento.
**Arquivos afetados:**
- `apps/web/components/workflows/PublishModal.tsx`
- `apps/web/app/api/workflows/[id]/publish/route.ts`
**Estimativa:** 8h

### Story 3.2: Monetização via Stripe (Templates Premium)
**Tasks:**
- [ ] Criar produtos no Stripe automaticamente quando um workflow Premium for publicado.
- [ ] Criar fluxo de Checkout (Stripe Payment Links ou Checkout Session) para usuários comprarem templates.
- [ ] Registrar compras em uma nova tabela `user_purchases` para liberar acesso ao template na Story 2.1.
**Critérios de Aceite:**
- Usuários não podem instalar templates pagos sem um registro de compra válido.
**Testes:**
- Integração E2E: Comprar um template com cartão de teste e verificar a liberação.
**Arquivos afetados:**
- `packages/database/src/schema/purchases.ts` (NOVA)
- `apps/web/app/api/stripe/checkout-template/route.ts`
**Estimativa:** 24h

---

## Épico 4: Sistema de Avaliações e Rankings
**Resultado Esperado:** Garantir controle de qualidade através da comunidade.

### Story 4.1: Reviews e Rating
**Tasks:**
- [ ] Criar tabela `workflow_reviews` (rating de 1 a 5, comentário, autor).
- [ ] Criar componente de Review na página do template.
- [ ] Endpoint para enviar avaliação (Apenas para quem instalou o template).
- [ ] Trigger ou rotina de agregação para atualizar `ratingAvg` na tabela `workflows`.
**Critérios de Aceite:**
- Um usuário só pode avaliar um template 1 vez.
- Não é possível avaliar sem ter feito o download.
**Arquivos afetados:**
- `packages/database/src/schema/reviews.ts` (NOVA)
- `apps/web/app/api/marketplace/reviews/route.ts`
**Estimativa:** 12h
