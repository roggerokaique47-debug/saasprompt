# BUGS CONHECIDOS (09_BUGS.md)

Lista de bugs ativos reportados e seu status.

| ID | Área | Descrição do Bug | Severidade | Status |
|----|------|------------------|------------|--------|
| BUG-001 | Engine | Se o Node retornar um objeto muito denso ou binário, o salvamento no Inngest falha (payload too large). | Média | ⚠️ Ativo |
| BUG-002 | React Flow | Nós desconectados que não iniciam via Trigger explodem a topologicalSort e crasham o worker silenciosamente. | Alta | ⚠️ Ativo |
| BUG-003 | Autenticação | Se o usuário perde o cookie do Supabase no meio da sessão, a proteção Multi-tenant redireciona bruscamente sem aviso Toast. | Baixa | ⚠️ Ativo |
