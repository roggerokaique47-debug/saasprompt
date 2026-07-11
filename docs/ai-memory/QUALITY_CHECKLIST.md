# QUALITY CHECKLIST (QUALITY_CHECKLIST.md)

Critérios de aceite para liberação do sistema (Launch).

[ ] Testes Unitários 100% no `@prompthub/engine`
[ ] Testes E2E (Playwright) para o Canvas do Workflow
[ ] Build no Vercel (0 Warnings de TS)
[ ] Build Docker dos Workers (Inngest self-hosted / Homologação)
[ ] Performance Core Web Vitals (Lighthouse > 95 no App Público)
[ ] Segurança de Auth (Supabase RLS validado contra vazamento Multi-tenant)
[ ] Segurança de Execução (Sandbox WebWorker sem acesso ao `fs` para Node Javascript/Code)
[ ] Prevenção contra SQL Injection e Server Actions blindadas via Zod
[ ] Tratamento de Proteção contra XSS em inputs de Nodes Textuais
[ ] Rate Limit nos Webhooks de Inbound (`Upstash/Redis` ou Vercel KV)
[ ] OAuth Consent Screen e Scopes autorizados via Google Cloud Console
[ ] LGPD / GDPR Termos de Privacidade definindo tempo de retenção do logs de execução
