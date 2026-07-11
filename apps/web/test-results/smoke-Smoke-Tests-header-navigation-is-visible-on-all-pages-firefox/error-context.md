# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Smoke Tests >> header navigation is visible on all pages
- Location: __tests__\e2e\smoke.spec.ts:57:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "NovaFlow AI" [ref=e5] [cursor=pointer]:
        - /url: /
        - img "NovaFlow AI" [ref=e6]
      - navigation [ref=e7]:
        - link "Workflows" [ref=e8] [cursor=pointer]:
          - /url: /workflows
        - link "Biblioteca" [ref=e9] [cursor=pointer]:
          - /url: /biblioteca
        - link "Integrações" [ref=e10] [cursor=pointer]:
          - /url: /integracoes
        - link "Planos" [ref=e11] [cursor=pointer]:
          - /url: /preco
      - generic [ref=e12]:
        - radiogroup "Idioma" [ref=e13]:
          - radio "PT" [checked] [ref=e14] [cursor=pointer]
          - radio "EN" [ref=e15] [cursor=pointer]
          - radio "ES" [ref=e16] [cursor=pointer]
        - radiogroup "Tema" [ref=e17]:
          - radio "Original" [checked] [ref=e18] [cursor=pointer]:
            - img [ref=e19]
          - radio "Claro" [ref=e21] [cursor=pointer]:
            - img [ref=e22]
          - radio "Escuro" [ref=e25] [cursor=pointer]:
            - img [ref=e26]
        - link "Entrar" [ref=e28] [cursor=pointer]:
          - /url: /login
  - main [ref=e30]:
    - generic [ref=e32]:
      - generic [ref=e33]:
        - heading "Crie fluxos de IA sem digitar uma linha de código." [level=1] [ref=e34]
        - paragraph [ref=e35]: Conecte WhatsApp, e-mail, CRM e bancos de dados em minutos. A NovaFlow AI automatiza tarefas repetitivas com agentes inteligentes — tudo em um construtor visual de arrastar e soltar.
        - generic [ref=e36]:
          - link "Garantir Acesso Antecipado" [ref=e37] [cursor=pointer]:
            - /url: "#vip-form"
            - text: Garantir Acesso Antecipado
            - img [ref=e38]
          - link "Ver como funciona" [ref=e41] [cursor=pointer]:
            - /url: "#como-funciona"
            - text: Ver como funciona
            - img [ref=e42]
        - generic [ref=e45]:
          - generic [ref=e46]: ✓ Criação em 5 minutos
          - generic [ref=e47]: ·
          - generic [ref=e48]: ✓ Sem cartão de crédito
          - generic [ref=e49]: ·
          - generic [ref=e50]: ✓ Templates prontos
        - generic [ref=e51]:
          - generic [ref=e52]: 🎯
          - generic [ref=e53]:
            - strong [ref=e54]: 1.000 créditos gratuitos
            - text: — apenas para os 100 primeiros cadastros
      - img [ref=e58]
    - generic [ref=e64]:
      - generic [ref=e65]:
        - paragraph [ref=e66]: VEJA NA PRÁTICA
        - heading "Veja como a NovaFlow transforma automação em minutos." [level=2] [ref=e67]
        - paragraph [ref=e68]: Uma demonstração rápida mostrando como criar um agente de IA para WhatsApp, conectar suas ferramentas e publicar em segundos.
        - list [ref=e69]:
          - listitem [ref=e70]:
            - generic [ref=e71]: ✓
            - text: Criação de fluxo visual em menos de 2 minutos
          - listitem [ref=e72]:
            - generic [ref=e73]: ✓
            - text: Conexão com WhatsApp, CRM e e-mail ao vivo
          - listitem [ref=e74]:
            - generic [ref=e75]: ✓
            - text: Painel de acompanhamento com métricas reais
      - button "Assista em 2 min" [ref=e77] [cursor=pointer]:
        - button [ref=e81]:
          - img [ref=e83]
        - generic [ref=e85]: Assista em 2 min
    - dialog:
      - generic:
        - button "Fechar": ✕
        - generic:
          - strong: 🎬 Vídeo demonstrativo
          - paragraph: Insira aqui o link do seu vídeo de demonstração (YouTube, Vimeo ou MP4).
          - generic: Por enquanto é um placeholder — substitua pelo embed real.
    - generic [ref=e87]:
      - generic [ref=e88]:
        - paragraph [ref=e89]: A PLATAFORMA DEFINITIVA
        - heading "Uma equipe inteira de IA à sua disposição 24/7." [level=2] [ref=e90]
      - generic [ref=e91]:
        - generic [ref=e92]:
          - img "WhatsApp" [ref=e94]
          - heading "Agentes de WhatsApp" [level=3] [ref=e95]
          - paragraph [ref=e96]: Atenda clientes, qualifique leads e recupere carrinhos abandonados de forma 100% autônoma.
        - generic [ref=e97]:
          - img "HubSpot" [ref=e99]
          - heading "Integração com CRMs" [level=3] [ref=e100]
          - paragraph [ref=e101]: Conecte nativamente HubSpot, Salesforce e mais. Dados de vendas atualizados em tempo real pelos seus agentes.
        - generic [ref=e102]:
          - img [ref=e104]
          - heading "Construtor visual de fluxos" [level=3] [ref=e109]
          - paragraph [ref=e110]: Monte automações complexas arrastando blocos. Dispare ações por data, mensagem, webhook ou agendamento.
    - generic [ref=e112]:
      - generic [ref=e113]:
        - paragraph [ref=e114]: COMO FUNCIONA
        - heading "Em 4 passos sua automação está no ar." [level=2] [ref=e115]
        - paragraph [ref=e116]: Sem complicação. Sem reunião técnica. A NovaFlow foi feita para quem quer resultados rápidos.
      - generic [ref=e117]:
        - generic [ref=e118]:
          - heading "Escolha um template" [level=3] [ref=e119]
          - paragraph [ref=e120]: "Navegue pela biblioteca com dezenas de fluxos prontos: atendimento, vendas, marketing, suporte. Ou comece do zero."
        - generic [ref=e121]:
          - heading "Conecte suas ferramentas" [level=3] [ref=e122]
          - paragraph [ref=e123]: Vincule WhatsApp, Google Sheets, CRM, e-mail e banco de dados em poucos cliques. A NovaFlow gerencia a autenticação.
        - generic [ref=e124]:
          - heading "Personalize o fluxo" [level=3] [ref=e125]
          - paragraph [ref=e126]: Arraste blocos, ajuste mensagens, defina regras. O construtor visual mostra exatamente o que cada agente vai fazer.
        - generic [ref=e127]:
          - heading "Ative e acompanhe" [level=3] [ref=e128]
          - paragraph [ref=e129]: Publique seu fluxo em segundos. O painel ao vivo mostra execuções, economia de tempo e retorno sobre cada automação.
      - generic [ref=e130]:
        - link "Criar Conta Grátis" [ref=e131] [cursor=pointer]:
          - /url: /cadastro
        - link "Ver Planos" [ref=e132] [cursor=pointer]:
          - /url: /preco
    - generic [ref=e134]:
      - generic [ref=e135]:
        - paragraph [ref=e136]: RESULTADOS
        - heading "Números que falam por si." [level=2] [ref=e137]
      - generic [ref=e138]:
        - generic [ref=e139]:
          - generic [ref=e140]: 12×
          - paragraph [ref=e141]: mais leads qualificados com os agentes de IA vs. formulários tradicionais.
        - generic [ref=e142]:
          - generic [ref=e143]: 3.200+
          - paragraph [ref=e144]: equipes que já automatizam vendas, suporte e operações com a plataforma.
        - generic [ref=e145]:
          - generic [ref=e146]: 40h/mês
          - paragraph [ref=e147]: em média de horas recuperadas por equipe — tempo que volta para o que importa.
    - generic [ref=e149]:
      - generic [ref=e150]: "\""
      - blockquote [ref=e151]: Em dois dias tínhamos um agente no WhatsApp respondendo 80% das perguntas dos clientes. A NovaFlow transformou nosso suporte sem precisar de um time de TI.
      - paragraph [ref=e152]: Marina Lemos, Head de Operações na BuildBox
    - generic [ref=e155]:
      - generic [ref=e156]:
        - generic [ref=e157]: Comprovado em Dados
        - heading "Calculadora de ROI" [level=2] [ref=e158]
        - paragraph [ref=e159]: Descubra o quanto você economiza automatizando suas tarefas repetitivas.
      - generic [ref=e162]:
        - generic [ref=e163]:
          - heading "1 Preencha seus dados" [level=3] [ref=e164]:
            - generic [ref=e165]: "1"
            - text: Preencha seus dados
          - generic [ref=e166]:
            - generic [ref=e167]:
              - generic [ref=e168]:
                - generic [ref=e169]: Horas manuais por semana
                - generic [ref=e170]: 15h
              - slider [ref=e172] [cursor=pointer]: "15"
              - paragraph [ref=e173]: Tempo gasto com emails, planilhas e copy-paste.
            - generic [ref=e174]:
              - generic [ref=e175]:
                - generic [ref=e176]: Custo da Hora (R$)
                - generic [ref=e177]: R$ 50
              - slider [ref=e179] [cursor=pointer]: "50"
              - paragraph [ref=e180]: Quanto vale a sua hora ou a hora do seu time.
        - generic [ref=e184]:
          - heading "2 Economia Estimada" [level=3] [ref=e185]:
            - generic [ref=e186]: "2"
            - text: Economia Estimada
          - generic [ref=e187]:
            - generic [ref=e188]: R$ 2.903
            - generic [ref=e189]: / ao mês
          - paragraph [ref=e191]:
            - text: Isso representa impressionantes
            - strong [ref=e192]: R$ 34.836
            - generic [ref=e193]: de lucro extra por ano!
    - generic [ref=e195]:
      - generic [ref=e196]:
        - paragraph [ref=e197]: INTEGRAÇÕES
        - heading "Conecta com as ferramentas que você já usa." [level=2] [ref=e198]
        - paragraph [ref=e199]: Mais de 50 integrações nativas. Nenhuma linha de código necessária.
      - generic [ref=e200]:
        - generic [ref=e201]:
          - img "WhatsApp" [ref=e203]
          - generic [ref=e204]: WhatsApp
        - generic [ref=e205]:
          - img "OpenAI" [ref=e207]
          - generic [ref=e208]: OpenAI
        - generic [ref=e209]:
          - img "Google Sheets" [ref=e211]
          - generic [ref=e212]: Google Sheets
        - generic [ref=e213]:
          - img "Gmail" [ref=e215]
          - generic [ref=e216]: Gmail
        - generic [ref=e217]:
          - img "Stripe" [ref=e219]
          - generic [ref=e220]: Stripe
        - generic [ref=e221]:
          - img "Shopify" [ref=e223]
          - generic [ref=e224]: Shopify
        - generic [ref=e225]:
          - img "Slack" [ref=e227]
          - generic [ref=e228]: Slack
        - generic [ref=e229]:
          - img "HubSpot" [ref=e231]
          - generic [ref=e232]: HubSpot
        - generic [ref=e233]:
          - img "Discord" [ref=e235]
          - generic [ref=e236]: Discord
        - generic [ref=e237]:
          - img "GitHub" [ref=e239]
          - generic [ref=e240]: GitHub
        - generic [ref=e241]:
          - img "PostgreSQL" [ref=e243]
          - generic [ref=e244]: PostgreSQL
        - generic [ref=e245]:
          - img "Gemini" [ref=e247]
          - generic [ref=e248]: Gemini
    - generic [ref=e251]:
      - paragraph [ref=e252]: ACESSO ANTECIPADO
      - heading "Entre para a Lista VIP" [level=2] [ref=e253]
      - paragraph [ref=e254]:
        - text: Seja um dos primeiros a usar a NovaFlow. Os 100 primeiros cadastros ganham
        - strong [ref=e255]: 1.000 créditos gratuitos
        - text: vitalícios.
      - generic [ref=e256]:
        - generic [ref=e257]:
          - textbox "Nome" [ref=e258]:
            - /placeholder: Seu nome
          - textbox "E-mail" [ref=e259]:
            - /placeholder: Seu melhor e-mail
          - button "Garantir Acesso Antecipado" [ref=e260] [cursor=pointer]
        - paragraph [ref=e261]: 🔒 Seus dados estão seguros. Sem spam. Cancele quando quiser.
  - contentinfo [ref=e262]:
    - generic [ref=e263]:
      - generic [ref=e264]:
        - generic [ref=e265]:
          - link "NovaFlow AI" [ref=e266] [cursor=pointer]:
            - /url: /
            - img "NovaFlow AI" [ref=e267]
          - paragraph [ref=e268]: Plataforma de automação com IA para empresas que querem crescer sem complicação. Conecte WhatsApp, CRM, e-mail e muito mais.
        - generic [ref=e269]:
          - heading "Produto" [level=4] [ref=e270]
          - link "Workflows" [ref=e271] [cursor=pointer]:
            - /url: /workflows
          - link "Biblioteca" [ref=e272] [cursor=pointer]:
            - /url: /biblioteca
          - link "Planos" [ref=e273] [cursor=pointer]:
            - /url: /preco
          - link "Entrar" [ref=e274] [cursor=pointer]:
            - /url: /login
        - generic [ref=e275]:
          - heading "Soluções" [level=4] [ref=e276]
          - link "Atendimento WhatsApp" [ref=e277] [cursor=pointer]:
            - /url: /solucoes/atendimento-whatsapp
          - link "Recuperação de Vendas" [ref=e278] [cursor=pointer]:
            - /url: /solucoes/recuperacao-vendas
          - link "Automação de Marketing" [ref=e279] [cursor=pointer]:
            - /url: /solucoes/automacao-marketing
          - link "Automação de Vendas" [ref=e280] [cursor=pointer]:
            - /url: /solucoes/automacao-vendas
          - link "Automação de Suporte" [ref=e281] [cursor=pointer]:
            - /url: /solucoes/automacao-suporte
          - link "Todas Integrações" [ref=e282] [cursor=pointer]:
            - /url: /integracoes
        - generic [ref=e283]:
          - heading "Legal & Suporte" [level=4] [ref=e284]
          - link "Termos de Uso" [ref=e285] [cursor=pointer]:
            - /url: /termos-de-uso
          - link "Privacidade" [ref=e286] [cursor=pointer]:
            - /url: /politica-de-privacidade
          - link "Cookies" [ref=e287] [cursor=pointer]:
            - /url: /cookies
          - link "Central de Ajuda" [ref=e288] [cursor=pointer]:
            - /url: /ajuda
          - link "Status do Sistema" [ref=e289] [cursor=pointer]:
            - /url: /status
      - generic [ref=e290]:
        - paragraph [ref=e291]: © 2026 NovaFlow AI. Todos os direitos reservados.
        - generic [ref=e292]:
          - link "Twitter" [ref=e293] [cursor=pointer]:
            - /url: "#"
            - img [ref=e294]
          - link "LinkedIn" [ref=e296] [cursor=pointer]:
            - /url: "#"
            - img [ref=e297]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Smoke Tests', () => {
  4  |   test('homepage loads with hero and featured sections', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page.locator('h1')).toBeVisible();
  7  |     await expect(page.locator('text=Criar Conta Grátis').first()).toBeVisible();
  8  |   });
  9  | 
  10 |   test('biblioteca page loads with search and filters', async ({ page }) => {
  11 |     await page.goto('/biblioteca');
  12 |     await expect(page.locator('h1')).toContainText('Marketplace de templates');
  13 |     await expect(page.locator('input[type="search"]').first()).toBeVisible();
  14 |   });
  15 | 
  16 |   test('pricing page shows plan options', async ({ page }) => {
  17 |     await page.goto('/preco');
  18 |     await expect(page.locator('h1')).toContainText('Planos');
  19 |   });
  20 | 
  21 |   test('login page has form and social options', async ({ page }) => {
  22 |     await page.goto('/login');
  23 |     await expect(page.locator('h1')).toContainText('Bem-vindo de volta');
  24 |     await expect(page.locator('input[name="email"]')).toBeVisible();
  25 |     await expect(page.locator('input[name="password"]')).toBeVisible();
  26 |     await expect(page.locator('text=Google')).toBeVisible();
  27 |   });
  28 | 
  29 |   test('signup page has form and social options', async ({ page }) => {
  30 |     await page.goto('/cadastro');
  31 |     await expect(page.locator('h1')).toContainText(/crie sua conta/i);
  32 |     await expect(page.locator('input[name="name"]')).toBeVisible();
  33 |     await expect(page.locator('input[name="email"]')).toBeVisible();
  34 |     await expect(page.locator('input[name="password"]')).toBeVisible();
  35 |   });
  36 | 
  37 |   test('comunidade page has marketplace title', async ({ page }) => {
  38 |     await page.goto('/comunidade');
  39 |     await expect(page.locator('h1')).toContainText('Marketplace de Automacoes');
  40 |   });
  41 | 
  42 |   test('artigos listing page loads', async ({ page }) => {
  43 |     await page.goto('/artigos');
  44 |     await expect(page.locator('h1')).toContainText('Artigos');
  45 |   });
  46 | 
  47 |   test('workflows listing page loads', async ({ page }) => {
  48 |     await page.goto('/workflows');
  49 |     await expect(page.locator('h1')).toContainText('Automações prontas para usar');
  50 |   });
  51 | 
  52 |   test('admin page redirects to login when unauthenticated', async ({ page }) => {
  53 |     await page.goto('/admin');
  54 |     await page.waitForURL('**/login**');
  55 |   });
  56 | 
  57 |   test('header navigation is visible on all pages', async ({ page }) => {
> 58 |     await page.goto('/');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  59 |     const header = page.locator('header, nav').first();
  60 |     await expect(header).toBeVisible();
  61 |     await expect(header).toBeVisible();
  62 |     await expect(header.locator('img[alt="NovaFlow AI"]').or(header.locator('img[alt="PromptHub"]'))).toBeVisible();
  63 |   });
  64 | 
  65 |   test('browser back/forward works between pages', async ({ page }) => {
  66 |     await page.goto('/');
  67 |     const title1 = await page.locator('h1').textContent();
  68 |     await page.goto('/biblioteca');
  69 |     await expect(page.locator('h1')).toContainText('Marketplace de templates');
  70 |     await page.goBack();
  71 |     await expect(page.locator('h1').first()).toBeVisible();
  72 |   });
  73 | });
  74 | 
```