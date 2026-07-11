# REFERÊNCIA DE APIS E ROTAS (05_API_REFERENCE.md)

Todas as rotas vivem em `apps/web/app/api/`. Usamos Route Handlers do Next.js (App Router).

## `/api/workflows/execute` [POST]
Recebe o ID de um Workflow, o Payload Inicial (caso seja um webhook) e envia para o Inngest (`inngest.send({ name: 'workflow/execute' })`). 
Responde **202 Accepted** rapidamente, transferindo o trabalho pesado pra Queue.

## `/api/executions/[id]/steps` [POST] (Interna Worker)
Rota fechada (`x-internal-key`). O Worker chama isso a cada NÓ que inicia ou termina.
Faz o **upsert** na tabela `execution_steps`.

## `/api/executions/[id]/update` [POST] (Interna Worker)
Rota fechada (`x-internal-key`). Atualiza o status geral da Tabela Máster `executions` (por exemplo, quando atinge `completed` ou `failed` e salva o JSON do `output` consolidado final).

## `/api/ai/generate-workflow` [POST]
Recebe `{ prompt: "String" }`. Pede pra OpenAI (ou Anthropic) gerar a base JSON do React Flow (`nodes` e `edges`).
A API faz sanitize da resposta, removendo Markdown Blocks, parseia e joga os Nodes/Edges para o Client montar a tela.

## `/api/ai/copilot` [POST]
Recebe o estado atual (`nodes` e `edges` em tela). A IA deduz o contexto atual do fluxo do usuário e retorna qual é o próximo `nodeType` mais provável (Ex: "Parece que você baixou o Gmail, quer jogar numa Planilha?").

## Padrões Adotados (API):
1. Todo payload de entrada DEVE ser validado via Zod.
2. Todo endpoint externo tem verificação `supabase.auth.getUser()`.
3. Erros retornam estrutura padrão `{ error: string }` no status HTTP correto.
