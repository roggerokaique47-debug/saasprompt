# Definition of Done (DoD)

Uma funcionalidade só pode ser considerada pronta quando cumprir **TODOS** os itens abaixo:

- [ ] **Código implementado**: O código atende a todos os requisitos e critérios de aceite descritos na tarefa.
- [ ] **Testes unitários**: O código possui testes unitários que garantem seu comportamento isolado.
- [ ] **Testes E2E**: Fluxos críticos que englobam a funcionalidade foram cobertos por testes ponta a ponta (E2E).
- [ ] **Documentação atualizada**: Manuais, guias de API, READMEs ou arquivos de arquitetura afetados foram atualizados.
- [ ] **Arquitetura atualizada**: Caso haja mudança estrutural, arquivos como `MASTER_PLAN.md` ou `ARCHITECTURE.md` refletem o novo estado.
- [ ] **Changelog atualizado**: Adição da funcionalidade no arquivo de registro de versões.
- [ ] **Sem vulnerabilidades críticas**: Ferramentas de análise estática e linter não acusam problemas de segurança de alta severidade.
- [ ] **Performance validada**: O tempo de resposta ou execução da nova funcionalidade está dentro dos limites aceitáveis.
- [ ] **Revisão de código aprovada**: Pelo menos um outro desenvolvedor (ou análise minuciosa via CI/IA) revisou e aprovou o PR.
- [ ] **Segurança validada**: Controle de acesso, autenticação e mitigação de vulnerabilidades (ex: validação de inputs) verificados conforme `SECURITY_ARCHITECTURE.md`.
- [ ] **Cobertura mínima de testes atingida**: A cobertura global do projeto ou módulo não caiu abaixo da meta de 80%.
- [ ] **Logs e métricas implementados**: A nova funcionalidade emite logs de erro, auditoria e telemetria necessários para observabilidade em produção.

> **Objetivo:** Seguir este DoD evita que o projeto acumule dívida técnica e garante que as entregas possuam qualidade de nível Enterprise.
