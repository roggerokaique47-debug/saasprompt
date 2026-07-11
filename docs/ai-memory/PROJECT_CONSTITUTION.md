# CONSTITUIÇÃO DO PROJETO (NovaFlow AI)

Este documento contém as **Regras Imutáveis** do projeto. 
Uma Inteligência Artificial ou Engenheiro **NUNCA** pode violar estas regras sem uma aprovação explícita de mudança de constituição.

## 1. Engine e Orquestração
- **Nunca executar workflows longos dentro de requisições do Next.js.**
- **Toda execução longa deve usar Workers (Inngest).** A Vercel vai dar timeout (Max 60s) em fluxos que tenham nós de `delay` ou que aguardem APIs externas pesadas.
- O Frontend só pode chamar `/api/workflows/execute` (que enfileira o Job) e assinar os eventos do banco via WebSockets para ver o progresso.

## 2. Padrão de Nós (Nodes)
Todo novo Node deve obrigatoriamente possuir em `packages/nodes/src/<nome_do_node>/`:
- `execute.ts` (O código isolado que roda a lógica com try/catch).
- `schema.ts` (Zod para validar inputs/outputs e renderizar configs).
- `icon.svg` (Obrigatório para a UI).
- `manifest.ts` (Nome, categoria, etc).
- `README.md` (Como usar e quais scopes OAuth exige).

## 3. Segurança e Banco de Dados
- **Toda nova tabela criada precisa possuir Row Level Security (RLS)** ativado e Policies definidas limitando o acesso ao dono (`user_id` ou `organization_id`).
- **Nunca acessar o banco de dados diretamente pelo lado Frontend (Client Components).** Sempre passe por Server Actions ou API Routes.
- **Toda API route deve possuir validação de payload via Zod.**
- **Nunca coloque API Keys (Tokens, Senhas) hardcoded ou armazenados limpos dentro do `workflow_json`.** Sempre use a tabela `credentials` e faça a referência pelo `credentialId`.

## 4. Arquitetura Multi-Tenant e Planos
- **Toda feature deve funcionar obrigatoriamente em ambiente Multi Tenant** (com suporte a Organizações e Convites).
- **Toda feature deve respeitar a infraestrutura de Planos** (Free, Pro, Enterprise). Ações que custam dinheiro (APIs da OpenAI) ou processamento alto (Workers) devem ser debitadas dos "Créditos" da Organização no banco antes de rodarem.

## 5. Qualidade de Código
- **Sempre usar TypeScript Strict Mode.** 
- **Nunca utilizar `any`.** Utilize `unknown` com asserções `zod` se não souber o tipo.
- **Todo código crítico (especialmente a Engine de grafos) deve possuir testes.**
