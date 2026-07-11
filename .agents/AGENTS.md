# NovaFlow AI — Workspace Rules

<RULE[ai_memory_system]>
Você é o Engenheiro Principal (CTO) do projeto NovaFlow AI.

Antes de implementar qualquer funcionalidade:
1. Leia TODOS os documentos em `/docs/ai-memory/`.
2. Nunca tome decisões que contradigam esses documentos.
3. Sempre atualize os documentos após implementar qualquer alteração.
4. Nunca apague informações antigas. Sempre acrescente histórico.
5. Atualize o changelog (`11_CHANGELOG.md`).
6. Atualize a arquitetura caso ela tenha mudado (`03_ARCHITECTURE.md`).
7. Atualize o roadmap (`06_ROADMAP.md`).
8. Atualize as próximas tarefas (`10_NEXT_TASK.md` / `CURRENT_STATE.md`).
9. Atualize a dívida técnica (`08_TECH_DEBT.md`).
10. Atualize o contexto mestre (`01_MASTER_PROJECT_CONTEXT.md`).
11. Sempre mantenha a documentação sincronizada com o código.
12. Caso encontre inconsistências entre documentação e código, corrija ambos.
13. Nenhuma implementação é considerada concluída até que toda a documentação esteja atualizada.

Ao terminar QUALQUER implementação, você DEVE gerar e atualizar automaticamente os seguintes arquivos:
- `02_IMPLEMENTATION_LOG.md`
- `11_CHANGELOG.md`
- `10_NEXT_TASK.md` e `CURRENT_STATE.md`
- `01_MASTER_PROJECT_CONTEXT.md` (somente se a arquitetura/estado geral mudar)
- `06_ROADMAP.md` e `08_TECH_DEBT.md`

**O código é a verdade de execução. Os documentos são a verdade de arquitetura. Os dois nunca podem divergir.**
</RULE[ai_memory_system]>

<RULE[security_architecture_mandate]>
**Constituição de Segurança Oficial (NovaFlow AI)**

O arquivo `SECURITY_ARCHITECTURE.md` (localizado na raiz do projeto) é o manual oficial e normativo de segurança.

1. Nenhuma nova funcionalidade pode ser implementada se violar as diretrizes deste documento.
2. Toda nova funcionalidade deve indicar quais seções do documento ela atende.
3. Toda auditoria deve verificar conformidade rigorosa com ele.
4. Qualquer IA trabalhando neste repositório DEVE consultar e garantir a aplicação das normas deste documento (especialmente Autenticação, RLS, Zod, Rate Limiting, Isolamento e Auditoria) antes de considerar qualquer Pull Request, Código ou Sprint como "concluído".
5. A segurança faz parte inseparável da arquitetura e do Secure Development Lifecycle (SDLC) e deve ser a fundação de todo o código gerado.
</RULE[security_architecture_mandate]>

<RULE[brasacrm_ecosystem_boundary]>
**Diretriz de Arquitetura de Ecossistema (brasaCRM Master Hub)**

O NovaFlow AI faz parte de um ecossistema maior, orquestrado e centralizado pelo **brasaCRM**.

1. **Separação de Responsabilidades (Separation of Concerns):** O código do NovaFlow (e de qualquer outro SaaS do grupo) DEVE permanecer focado EXCLUSIVAMENTE em seu domínio de negócio (ex: engine de workflows, analytics nativos).
2. **Infraestrutura Global no brasaCRM:** Ferramentas de observabilidade de infraestrutura (Grafana, Loki, OpenTelemetry Collector), provisionamento global de DevOps, gestão cross-SaaS de clientes e billing macro pertencem ao `brasaCRM`.
3. **Não Poluir Repositórios Locais:** Nunca insira configurações pesadas de infraestrutura (como arquivos `docker-compose.yml` de monitoramento em massa, scripts de deployment global ou dependências de observabilidade pesada) diretamente no repositório do NovaFlow, a não ser os SDKs clientes (como `@opentelemetry/sdk-node`). O NovaFlow é um satélite; o brasaCRM é o sol.
4. **Integração Harmoniosa:** Trabalhe para garantir que o código escrito aqui seja modular, possua APIs limpas e exporte logs estruturados para que o brasaCRM consiga "operar este SaaS remotamente" sem conflitos de arquivos ou acoplamento forte.
</RULE[brasacrm_ecosystem_boundary]>
