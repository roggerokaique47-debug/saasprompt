# REFERÊNCIA DE BANCO DE DADOS (v1.0 FROZEN)

**Tecnologia:** Supabase (PostgreSQL) + Drizzle ORM (`packages/database`)
**Conexão:** Pooling nativo gerenciado pelo Supabase.

## Visão Geral de Tabelas (As Core)

### 1. `organizations` e `members` (Multi-tenant)
Todo o acesso de dados é baseado em organizações. O usuário pode ter a sua e participar da de outras pessoas.
- **Campos chaves:** `slug`, `plan`, `owner_id`.
- O `RLS` deve forçar a política `EXISTS (SELECT 1 FROM members WHERE ...)` para tabelas filhas.

### 2. `workflows` e `workflow_versions`
`workflows` guarda os metadados (id, nome, org_id).
`workflow_versions` guarda a estrutura real `jsonb` do Grafo.
*Nota de Arquitetura:* Nunca dar UPDATE no grafo JSON. Sempre criar uma nova versão (Append Only) em `workflow_versions`. Isso permite dar rollback e garante que Execuções Antigas achem sua estrutura matemática intacta.

### 3. `executions` e `execution_steps`
`executions` é o Cabeçalho (Master). Contém Status (`running`, `completed`, `failed`), `duration_ms` e `trigger`.
`execution_steps` é o log atômico do Nó.
*Feature cruda:* O campo `status` do `execution_steps` tem Supabase Realtime ativo (`ALTER PUBLICATION supabase_realtime ADD TABLE execution_steps;`). Nunca remova isso, a UI depende disso para a barra de progresso.

### 4. `credentials`
Tabela com RLS estrito e de acesso super restrito na aplicação. Guarda dados encriptados (`encrypted_data`).
Os Nodes que precisam de autenticação (OAuth Google, API Keys) injetam o `credential_id` no nó e a Engine resolve a secret em tempo real.

## Row Level Security (RLS)
NUNCA desligue o RLS. O padrão do sistema é:
```sql
CREATE POLICY "owner only" ON {tabela} FOR ALL USING (user_id = auth.uid());
```
Sempre que adicionar uma tabela, escreva no `migration_vx.sql` a política RLS.
