# Architecture Decision Records (07_DECISIONS.md)

Este documento registra as decisões que impactam a arquitetura, para não ficarmos debatendo escolhas passadas.

## ADR-001: Filas e Background Jobs
**Decisão:** Usar **Inngest** ao invés de Redis/BullMQ nativo.
**Por que:** 
Para não gerenciar infraestrutura de Redis e processos Node pesados rodando em background 24/7. O Inngest nos permite disparar funções severless através do Vercel e orquestrar `retries` (backoff) transparentemente. Escala horizontalmente de forma passiva.

## ADR-002: Observabilidade de Tempo Real
**Decisão:** Usar **Supabase Realtime (WebSockets nativos do Postgres)** ao invés de Socket.io Customizado.
**Por que:** 
Reduz drasticamente a complexidade do Backend. O Worker apenas faz um INSERT/UPDATE normal na tabela `execution_steps`. O Banco, vendo a alteração de linha, propaga automaticamente via WebSocket PubSub direto para o navegador React do usuário, sem intervenção do nosso Next.js. O custo é ínfimo.

## ADR-003: Armazenamento da Árvore de Workflow
**Decisão:** Salvar o fluxo visual como `JSONB` no Postgres, em vez de criar tabelas relacionais de `Node` e `Edge` atômicos.
**Por que:** 
Evita joins absurdos na tabela para remontar um grafo (um grafo grande teria 100 consultas). Como o Grafo é desenhado pelo React Flow, armazenamos e recuperamos 1 para 1. Como contrapartida, usamos a tabela Append Only `workflow_versions` para evitar que uma mutação corrompa o grafo de quem já estava executando.

## ADR-004: Monorepo
**Decisão:** Usar **Turborepo** dividindo front e regras de negócios pesadas.
**Por que:**
O pacote `@prompthub/engine` pode virar um NPM Package de SDK comercializável no futuro. Nós isolamos a lógica matemática para que a plataforma web não vire um monolito sujo.
