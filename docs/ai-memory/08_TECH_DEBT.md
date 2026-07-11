# DÍVIDAS TÉCNICAS (08_TECH_DEBT.md)

Este arquivo lista débitos técnicos assumidos para garantir a velocidade do projeto, com foco em resolvê-los antes do Launch (V1.0).

## 1. Sandbox no Nó de Código (Security) - [RESOLVIDO]
**O problema:** O nó "Code" (`packages/nodes/src/code`) executava via eval nativo.
**Ação Tomada:** Implementado `quickjs-emscripten` que cria um Isolate puramente WebAssembly sem acesso ao `process.env` ou `fs`, com limites de CPU/Memória.


## 2. Ausência de Rate Limit em Webhooks Inbound (DDoS)
**O problema:** Rotas de entrada não têm limitação de disparos.
**Por que é ruim:** Disparos de 100 mil requisições num webhook exposto de um cliente gratuito podem esgotar nossa conta do Supabase e Inngest em 1 hora.
**Ação:** Criar Upstream Rate Limiting no Next.js Route (`Upstash Redis` ou `Rate Limit Cloudflare`).

## 3. APIs Mockadas nos Nós
**O problema:** Muitos nós como Gmail e Slack têm a interface, os ícones e os esquemas Zod prontos, mas dentro de `execute.ts` dão um "fake timeout" ou log console e retornam mock.
**Por que é ruim:** Falso positivo funcional.
**Ação:** Ligar as integrações via OAuth na Tabela Credentials.

## 4. Validação Circular e Órfã no React Flow
**O problema:** A Engine quebra e acusa erro ao topar com loop circular não tratado profundamente ou com nós não interligados, parando a esteira abruptamente.
**Ação:** O `<WorkflowEditor>` precisa ter uma "validação de Linting" antes de permitir o clique no botão Salvar/Simular, varrendo o DAG.
