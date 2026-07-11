# LIMITAÇÕES CONHECIDAS (KNOWN_LIMITATIONS.md)

Este documento centraliza as features que escolhemos conscientemente **NÃO** suportar na versão atual (V1.0.0) para manter o foco e entregar o software mais rápido.

**O sistema atualmente NÃO suporta:**
- Loop infinito ou `for-each` visual entre Nós.
- Agendador avançado (Crons complexos via UI).
- Node nativo de Python e Go (Apenas JS/TS via Web Worker Sandbox).
- Clusterização extrema de Redis (Usando Inngest nativo Serverless).
- Backoff e Retry exponencial customizável na interface gráfica (Retry configurado apenas a nível de infraestrutura de Workers global).
- Importação/Exportação do Graph como arquivo físico (`.json` local) via UI.
