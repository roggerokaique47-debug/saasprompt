# 🛡️ NovaFlow AI - Constituição de Segurança (v1.0 FROZEN)

Este documento não é apenas informativo; ele é **normativo**. É a Constituição de Segurança do NovaFlow AI. 

> [!CAUTION]
> Nenhum Pull Request (PR) pode ser aprovado se violar as diretrizes deste documento. Toda nova feature deve indicar quais seções do documento ela atende. Toda auditoria deve verificar conformidade com as regras impostas aqui. Se qualquer item do *Security Checklist* (Seção 19) estiver ausente, a feature **não é considerada pronta**.

---

## Índice

1. [Security Principles](#1-security-principles)
2. [Threat Model](#2-threat-model)
3. [Production Architecture](#3-production-architecture)
4. [Multi-Tenant Isolation](#4-multi-tenant-isolation)
5. [Authentication](#5-authentication)
6. [Authorization (RBAC)](#6-authorization-rbac)
7. [Secrets Management](#7-secrets-management)
8. [API Security](#8-api-security)
9. [Webhook Security](#9-webhook-security)
10. [Workflow Engine Security](#10-workflow-engine-security)
11. [LLM Security](#11-llm-security)
12. [Database Security](#12-database-security)
13. [Infrastructure Security](#13-infrastructure-security)
14. [Network Security](#14-network-security)
15. [Backup & Disaster Recovery](#15-backup--disaster-recovery)
16. [Monitoring & Incident Response](#16-monitoring--incident-response)
17. [Compliance](#17-compliance)
18. [Secure Development Lifecycle (SDLC)](#18-secure-development-lifecycle)
19. [Security Checklist](#19-security-checklist)
20. [Future Improvements](#20-future-improvements)

---

## 1. Security Principles

Todas as decisões arquitetônicas do NovaFlow AI baseiam-se nestes princípios imutáveis:
- **Zero Trust:** Nunca confie no navegador, cliente ou rede. Toda requisição (mesmo interna) exige autenticação e autorização contínua.
- **Least Privilege:** Entidades e serviços operam com o mínimo de permissão necessária (ex: read-only tokens onde aplicável).
- **Defense in Depth:** Segurança em camadas. Se a Cloudflare falhar, a API segura; se a API falhar, o RLS do banco segura.
- **Secure by Default:** Assuma que o acesso é negado. A permissão deve ser concedida explicitamente.
- **Fail Secure:** Em caso de erro, crashe negando acesso, nunca abrindo uma brecha.
- **Multi-Tenant Isolation:** Divisão estrita; os dados de um cliente nunca devem se encontrar com os de outro.
- **Privacy by Design:** Dados sensíveis nunca são logados e só são manipulados sob demanda com expiração temporal.
- **Security as Code:** Infraestrutura reproduzível, versionada e imutável.

---

## 2. Threat Model

Riscos mapeados na plataforma e respostas estratégicas:

| Ameaça | Impacto | Probabilidade | Mitigação | Plano de Resposta |
|---|---|---|---|---|
| **Invasão de Contas (ATO)** | Crítico | Média | 2FA, Supabase Auth (Lockout/Rate Limit), Senhas Fortes | Invalidação de sessões, bloqueio temporário, redefinição obrigatória. |
| **Vazamento entre Tenants** | Crítico | Baixa | RLS no DB, `organization_id` obrigatório nas queries | Auditoria forense, isolamento da instância de DB, notificação (LGPD). |
| **Abuso de IA (Jailbreak)** | Alto | Alta | Context isolado, sandboxing, ausência de privilégios globais do LLM | Bloqueio automático por abuso de termos, rotacionamento de Keys de IA. |
| **Ataques a Webhooks** | Alto | Média | Validação HMAC SHA256, Replay Protection (Nonce+Timestamp) | Bloqueio da key de integração, banimento de IP originador no WAF. |
| **Uso Excessivo (DDoS / Resource)** | Médio | Alta | Rate Limiting (Upstash), Cloudflare WAF, Filas (BullMQ) com limits | Auto-scaling da infraestrutura Edge, circuit breakers temporários. |
| **Comprometimento de Credenciais** | Crítico | Baixa | Criptografia KMS/AES-256-GCM, Secret Rotation, nunca texto puro | Revogação em massa, rotação de chaves mestras e notificação imediata. |
| **Falhas em Workers** | Médio | Alta | Timeouts rígidos, Dead Letter Queues (DLQ), Heartbeat | Reinício do processo (`Restart: Always`), escalonamento no Redis, alertas (PagerDuty/Sentry). |

---

## 3. Production Architecture

O ecossistema é compartimentalizado. Os workers, por exemplo, não expõem portas HTTP, protegendo a Engine do escrutínio público.

```mermaid
graph TD
    A[Internet] --> B(Cloudflare: DNS + CDN + WAF + DDoS)
    B --> C(Load Balancer / Vercel Edge)
    C --> D(API Gateway / Middlewares)
    D --> E{Supabase Auth}
    
    subgraph Frontend / BFF
        F[Dashboard Next.js]
        G[Public API]
    end
    
    E --> F
    E --> G
    
    G --> H[(Redis - RateLimit / BullMQ)]
    H --> I[Queue Server]
    I --> J[Background Workers]
    
    subgraph Micro-Services (Integrações & IA)
        J --> K(LLM Gateway - OpenAI)
        J --> L(Gmail / Waha / Stripe)
    end
    
    J --> O((Engine de Workflows - QuickJS Sandboxed))
    O --> P[(PostgreSQL - RLS Enabled)]
    O --> Q[(Object Storage - Backups)]
    
    subgraph Observabilidade
        O -.-> R[Pino Logs + Auditoria]
        R --> S(OpenTelemetry)
        S --> T(Grafana / Sentry)
    end
```

---

## 4. Multi-Tenant Isolation

- Todo banco de dados contém uma hierarquia.
- Tabelas transacionais possuem a coluna `organization_id UUID NOT NULL`.
- Filtro obrigatório de código no Drizzle ORM: `where: eq(table.organizationId, ctx.currentOrgId)`.
- Row Level Security (RLS) habilitado no Supabase/PostgreSQL com `policies` estritas impedindo select, update ou delete fora do escopo do ID autenticado na JWT.

---

## 5. Authentication

- Proibida a criação de fluxos de login customizados; utilizamos exclusivamente **Supabase Auth**.
- Zero Trust: A presença do cookie/token deve ser validada no *Server Side* em todas as mutações (`supabase.auth.getUser()`).
- Tokens expiram e utilizam mecanismo de *Refresh Token* protegido.

---

## 6. Authorization (RBAC)

O controle de acesso é baseado em papéis (Role-Based Access Control) dentro de cada `Organization`:
- **Owner:** Controle total. Pode deletar a organização, alterar configurações críticas e gerir Billing.
- **Admin:** Pode gerenciar usuários, criar workflows, integrar chaves de API, mas não pode deletar a organização ou alterar faturamento de forma destrutiva.
- **Editor:** Apenas pode criar e editar workflows e prompts.
- **Operator:** Pode apenas visualizar métricas, disparar execuções manuais e aprovar nós pausados.
- **Viewer:** Leitura restrita (Auditoria).
- **Billing:** Acesso restrito apenas a faturas, pagamentos (Stripe) e relatórios financeiros.

---

## 7. Secrets Management

- **Regra de Ouro:** Nenhuma credencial externa (OpenAI Key, Slack Token, Stripe Secret) pode ser armazenada em texto puro.
- **Criptografia em Repouso:** Os segredos devem usar cifras modernas `AES-256-GCM`, `libsodium` ou `KMS`.
- As chaves mestras residem exclusivamente em `.env` das plataformas de cloud provider e não no Banco.
- Rotação mandatório de chaves no painel (BYOK) e política clara de revogação. O Worker jamais exporta ou "printa" tokens no console.

---

## 8. API Security

- **Rate Limit:** Aplicado estritamente por IP ou Organization via `@upstash/ratelimit`. Limites segmentados (ex: 100 req/10s).
- **Validação de Entrada:** Todo request body/query passa por validação **Zod**. Nenhuma variável acessa o banco antes do parser estrito.
- **Headers:** Habilitado Helmet (CORS restrito, CSRF protection, HSTS, `X-Frame-Options: DENY`).

---

## 9. Webhook Security

- **Validação Autenticada:** Não expor webhooks públicos fáceis de sofrer spam.
- **Assinatura (Signature):** Obrigatoriedade de HMAC SHA-256 no header.
- **Replay Protection:** Todos os webhooks carregam Timestamp e Nonce. O Timestamp tem tolerância máxima de 5 minutos, bloqueando requisições clonadas.
- **Idempotência:** Request ID rastreada; webhooks repetidos não executam operações bancárias ou disparos duplicados no Worker.

---

## 10. Workflow Engine Security

- **Sandboxing:** Toda execução de lógica dinâmica ou código (`Code Node`) deve ser isolada usando `quickjs-emscripten` ou V8 Isolates. Memória de 64MB máxima, interrupções por timeout de 5s.
- **Resiliência:** Execuções no Worker suportam Circuit Breakers. Falhas em nós injetam o erro no pipeline e pausam a execução. 

---

## 11. LLM Security

- **Prompt Injection Defense:** Modelos só possuem contexto de sistema hardcoded. Dados de input entram como user payload limitados e scaneados se necessário.
- **Isolamento RAG:** Os embeddings de uma Organização nunca se encontram com a outra no Vector DB.
- **Tool RBAC:** Se um Agente de IA tentar utilizar um Tool de Banco (ex: "Deletar Cliente"), a Engine primeiro verifica se a sessão humana criadora do prompt (ou disparadora) possui nível `Admin`.
- **Limites Físicos:** LLMs possuem limitação estrita de consumo de tokens (Cobrança por IA). Sem saldo, sem inferência. Loops são derrubados após limite máximo predefinido de iterações (`Max Steps = 15`).

---

## 12. Database Security

- Jamais realizar queries cruas;
- Proibição absoluta de `DELETE`, `UPDATE` e `DROP` sem auditoria (`audit_logs` tracking: user_id, action, org, tables, IP).
- Uso de soft-delete preferencial (`deleted_at`).

---

## 13. Infrastructure Security & Reproducibility (Infrastructure as Code)

- Todo ambiente deve ser recriável a qualquer momento de forma consistente via **Terraform / OpenTofu** ou Docker Compose.
- **Supply Chain:** Verificação de dependências automática (SBOM, Snyk/npm audit). 
- Imagens de container operam em modo **read-only** no root e não utilizam o usuário `root` padrão (`USER node`).

---

## 14. Network Security

- Nenhum serviço interno (Banco de Dados, Redis, Worker) é exposto para a internet; operam em uma Private VPC ou comunicação via túnel seguro.
- Todo acesso público é proxyfiado e saneado pelo Cloudflare (WAF/DDoS).
- Comunicações entre os micro-serviços sempre em TLS interno.

---

## 15. Backup & Disaster Recovery (DR)

O SLA alvo do NovaFlow AI é de **99.9%** de uptime (Disponibilidade).
- **RTO (Recovery Time Objective):** Menos de 4 horas em cenários de queda catastrófica.
- **RPO (Recovery Point Objective):** Menos de 1 hora de perda aceitável de dados.
- **Backups:** Dumps diários criptografados para bucket Object Storage independente da provedora.
- **Failover:** Arquitetura multi-az permitindo que réplicas read/write assumam imediatamente.
- **Testes:** Restauração testada periodicamente a cada 3 meses.
- **Rollback:** Deploys são *Blue/Green*.

---

## 16. Monitoring & Incident Response

- **Tracing Cross-Service:** Uso de `TraceID` e `CorrelationID` por todo o ciclo de vida da execução.
- **Mascaramento:** Tokens, chaves e senhas e dados sensíveis (PII) são ofuscados dos logs do `pino`.
- **Sentry / OpenTelemetry:** Notificação em tempo real (Slack de Devs) se o taxa de erro passar do baseline da anomalia.

---

## 17. Compliance

O produto é estruturado e preparado para:
- **LGPD/GDPR:** Permitir exclusão de contas e exportação de dados com um clique. Cookies são anonimizados.
- Práticas amigáveis para futura auditoria e relatórios normativos para certificações como **SOC 2** e **ISO 27001**.

---

## 18. Secure Development Lifecycle (SDLC)

Nenhum desenvolvedor burla a esteira. Cada ciclo (Sprint) deve passar pelo funil:
1. Análise de Arquitetura.
2. Revisão de Código Obrigatória (Code Review / Pull Request).
3. Testes Automatizados (Playwright / Vitest).
4. Testes de Segurança / Linting Estrito.
5. Atualização da Documentação (`REAL_STATUS.md` e Changelogs).
6. Aprovação Final (Deploy contínuo barrado na esteira se vermelho).

---

## 19. Security Checklist

Toda nova feature **deve** atender positivamente todos os pontos abaixo:

- [ ] Possui **Autenticação** e verificação no Server Side?
- [ ] Checou **Autorização (RBAC)** apropriada?
- [ ] Incorporou o RLS (`organization_id`) obrigatório?
- [ ] Entradas (Body, Query) validadas via `Zod`?
- [ ] Passa por `Rate Limiting`?
- [ ] Modifica dados sensíveis? Se sim, gera Log na tabela `audit_logs`?
- [ ] Possui tráfego de senhas? Estão `criptografadas` em repouso e movimento?
- [ ] Injeta Logs legíveis estruturados via `pino`?
- [ ] Os Testes (Unitários, Segurança ou E2E) foram implementados ou atualizados e estão passando?

> [!WARNING]
> Se a feature falhar em 1 único check, ela **não é considerada pronta**. O Pull Request não poderá ser aprovado.

---

## 20. Future Improvements

A segurança evolui; nosso roadmap prevê:
- Certificações ISO e SOC 2 formais.
- Análise Heurística avançada para detecção automática de Prompt Injections complexas antes delas tocarem nos Agentes.
- Rotação automática de Tokens de Bancos via HashiCorp Vault.
- Auditorias anuais de Pentest (Caixa Preta).
