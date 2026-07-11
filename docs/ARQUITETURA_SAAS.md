# 🛡️ Arquitetura Técnica SaaS — NovaFlow AI

Este documento detalha o funcionamento da infraestrutura B2B Multi-tenant, o fluxo automatizado de faturamento (Billing) e o design do motor de execução tolerante a falhas do NovaFlow AI.

---

## 👥 1. Isolamento Multi-tenant (WhatsApp & WAHA)

Para garantir que dados, mensagens e sessões de WhatsApp de clientes diferentes nunca se cruzem ou causem colisões, implementamos um padrão rígido de isolamento no motor e nas rotas de API.

### Fluxo de Sessões WAHA
Cada cliente do SaaS que conecta seu WhatsApp na plataforma recebe uma instância isolada gerenciada pelo WAHA (WhatsApp HTTP API).

1. **Geração do Nome da Sessão:**
   A sessão é nomeada de forma determinística utilizando o ID único do usuário no banco de dados:
   ```
   sessionName = `session_${user.id}`
   ```

2. **Segurança no Back-end (`/api/waha/sessions`):**
   - As requisições `GET`, `POST` e `DELETE` ignoram qualquer parâmetro dinâmico enviado pelo front-end que tente forçar nomes genéricos (como `default`).
   - O back-end intercepta a chamada, obtém o usuário autenticado via Supabase e injeta obrigatoriamente `session_${user.id}`.
   - No `GET`, a rota obtém todas as sessões do servidor WAHA e realiza um filtro local para devolver ao front-end apenas a sessão correspondente ao ID do usuário logado.

3. **Recepção de Mensagens (Webhook dinâmico):**
   - O endpoint `/api/waha/webhook` recebe os eventos de novas mensagens do WhatsApp.
   - Em vez de responder à sessão global (`default`), o webhook lê a propriedade `body.session` (injetada pelo WAHA contendo o nome da sessão receptora) e direciona as respostas da IA diretamente para ela.

---

## 💳 2. Automação do Ciclo Financeiro (Stripe Webhook)

O faturamento funciona de forma totalmente autônoma (*Zero Touch*). Quando uma compra é confirmada no gateway de pagamento (Stripe), os privilégios e tokens são entregues no mesmo instante.

### Eventos Mapeados no Webhook (`/api/payments/webhook`):

1. **`ACTIVATE_SUBSCRIPTION` (Assinatura Recorrente):**
   - Cria o registro na tabela `subscriptions`.
   - Executa uma atualização atômica na tabela `users` do Supabase:
     ```typescript
     await db.update(users).set({ plan: plan }).where(eq(users.id, userId));
     ```

2. **`ONE_TIME_PURCHASE` (Compra Única / Lifetime Deal):**
   - Salva a transação na tabela `purchases`.
   - Se o pacote adquirido for o **Lifetime Deal** (`contentId === 'lifetime'`):
     - Atualiza o plano do usuário para `lifetime`.
     - Incrementa a coluna `credits` do usuário com **+1000 tokens**.
   - Se for um **Pacote de Tokens avulso** (`contentType === 'tokens'`):
     - Incrementa a coluna `credits` do usuário com **+500 tokens**.

---

## ⚙️ 3. Resiliência do Motor de Execução (Engine)

O motor de execução de workflows (`packages/engine`) foi arquitetado para lidar com instabilidades comuns de APIs de terceiros.

### Mecanismo de Auto-Retry
Gargalos de rede e timeouts temporários de endpoints externos não quebram os fluxos do cliente.

- **Implementação do Retry (Nó `HTTP_REQUEST`):**
  Toda requisição HTTP disparada pelo motor é encapsulada em uma função de tentativa automática (`fetchWithRetry`):
  ```typescript
  const fetchWithRetry = async (retries = 3, delayMs = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        if (res.ok) return res;
        if (i === retries - 1) return res; // Retorna a resposta de erro na última tentativa
        await delay(delayMs);
      } catch (error) {
        if (i === retries - 1) throw error;
        await delay(delayMs);
      }
    }
  };
  ```
- **Taxa de Sucesso:** Aumenta a confiabilidade de integrações críticas (como webhooks de envio de CRM ou ERPs).

---

## 🔌 4. Novas Integrações Mapeadas (Prontas para Interface)

Para facilitar a migração de usuários de ferramentas consolidadas como Make.com e Zapier, as seguintes chaves de integração e executores mockados foram adicionados no core do motor (`packages/engine/src/executors.ts`):

- **HubSpot (`hubspot_create_contact`):** Criação automatizada de leads em funis de vendas B2B.
- **Typeform (`typeform_read`):** Coleta e leitura de novos leads de formulários interativos.
- **Notion (`notion_create_page`):** Registro de dados em bancos de dados no Notion.

Os executores estão estruturalmente prontos para receber tokens de API BYOK (Bring Your Own Key) e as requisições HTTP reais no próximo sprint de UI.
