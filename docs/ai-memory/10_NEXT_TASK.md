# PRÓXIMA TAREFA (10_NEXT_TASK.md)

**Próxima tarefa:**
Sprint 11: Auditoria e Consistência de Validação de Schemas (Technical Cleanup).
Garantir que todas as validações de schemas (Zod, TRPC e Drizzle) no repositório inteiro estão corretas, seguras e atualizadas para as novas assinaturas de versão.

**Motivação:** 
Com todos os nós e a arquitetura Multi-Tenant isolada e entregue em produção, precisamos garantir que o sistema não tenha brechas nas camadas de API e validações. Atualizações recentes no Zod (ex: z.record(z.string(), z.any())) revelaram pequenos débitos técnicos que precisam ser sistematicamente mitigados.

**Arquivos envolvidos:**
- `packages/shared/src/validations/*`
- `apps/web/app/api/**/*.ts`
- Definições e routers TRPC em `packages/api/src/`

**Dependências Atendidas:**
- [x] Sincronização da documentação de IA (Memória CTO).
- [x] Infraestrutura AES-256-GCM e `organizationId` robusta e testada.
- [x] Desmockagem Final (Nós concluídos).
- [x] Code Sandbox resolvido.

**Depois de fazer isso, o próximo passo é:**
Otimização final de UX e Lançamento Beta.

**Tempo Estimado (IA):**
~1.5 horas.
