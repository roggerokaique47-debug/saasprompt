# Release Checklist

Toda versão deve passar por este checklist de produção antes de ser publicada/liberada para os usuários.

- [ ] Build OK (O empacotamento das aplicações e pacotes ocorreu sem erros)
- [ ] Testes OK (Todos os testes automatizados passaram no CI/CD)
- [ ] Banco migrado (Migrations do Supabase/Prisma rodaram com sucesso sem perdas de dados)
- [ ] Backup realizado (O banco de dados de produção tem backup íntegro e recente)
- [ ] Rollback testado (O plano para reverter o deploy foi delineado e validado)
- [ ] Stripe funcionando (Integrações de Billing, Webhooks e Checkout verificadas)
- [ ] OAuth funcionando (Autenticação Google, GitHub, etc., operando normalmente)
- [ ] Gmail funcionando (Integração de e-mail core verificada)
- [ ] OpenAI funcionando (Conexão e chaves da API de IA estão saudáveis e com crédito)
- [ ] Workers funcionando (Filas em background processando jobs corretamente)
- [ ] Logs funcionando (Eventos de sistema estão sendo registrados na ferramenta de observabilidade)
- [ ] Alertas funcionando (Sentry, PagerDuty ou similar notificarão em caso de erro 500)
- [ ] Lighthouse > 90 (As métricas vitais de web no frontend público estão nos padrões de excelência)
- [ ] Segurança validada (RLS ativo, Rate Limits ativos e inputs validados)
- [ ] Performance validada (Sem gargalos impeditivos detectados no fluxo principal)
- [ ] Deploy realizado (A infraestrutura atualizou para a versão mais recente da branch de produção)
- [ ] Smoke Tests aprovados (Testes manuais ou scripts rápidos nas rotas críticas em produção retornaram status saudáveis)
