# Reestruturação do Código - Next.js

## 📁 Nova Estrutura de Diretórios

```
apps/web/
├── app/                      # Rotas e páginas (Next.js App Router)
├── components/               # Componentes React
│   ├── ui/                   # Componentes UI reutilizáveis
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── label.tsx
│   │   ├── table.tsx
│   │   └── index.ts          # Barrel export
│   ├── admin/                # Componentes específicos do admin
│   ├── auth/                 # Componentes de autenticação
│   ├── layout/               # Componentes de layout
│   └── ...
├── features/                 # Funcionalidades organizadas por domínio
│   ├── admin/                # Feature: Admin
│   │   ├── category-actions.ts
│   │   ├── prompt-actions.ts
│   │   └── index.ts          # Barrel export
│   ├── auth/                 # Feature: Autenticação
│   ├── articles/             # Feature: Artigos
│   ├── workflows/            # Feature: Workflows
│   ├── creator/              # Feature: Criador
│   └── purchase/             # Feature: Compra
├── hooks/                    # Hooks React personalizados
│   ├── use-auth.ts
│   └── index.ts
├── lib/                      # Utilitários e configurações de bibliotecas
│   ├── utils.ts              # Função cn() para classes Tailwind
│   └── index.ts
├── types/                    # Tipos TypeScript globais
│   ├── user.ts
│   ├── prompt.ts
│   ├── category.ts
│   ├── common.ts
│   ├── creator.ts
│   ├── purchase.ts
│   └── index.ts
├── utils/                    # Funções utilitárias
│   ├── slugify.ts
│   └── index.ts
├── constants/                # Constantes e configurações
│   ├── site-config.ts
│   ├── navigation.ts
│   ├── pricing.ts
│   └── index.ts
└── components.json           # Configuração shadcn/ui
```

## ✨ Melhorias Implementadas

### 1. **Separação por Domínios (Features)**
- Cada feature tem seu próprio diretório com actions, types e components
- Facilita a manutenção e escalabilidade
- Permite desenvolvimento independente de funcionalidades

### 2. **Componentes UI Centralizados**
- Componentes reutilizáveis em `components/ui/`
- Padrão consistente com shadcn/ui
- Fácil de estender e personalizar

### 3. **Types Centralizados**
- Todos os tipos TypeScript em `types/`
- Exportação via barrel file (`index.ts`)
- Reutilização em todo o projeto

### 4. **Server Actions Organizados**
- Actions agrupados por feature
- Padronização de retornos (ActionResponse)
- Validação com Zod

### 5. **Barrel Exports**
- Index files em todos os diretórios principais
- Imports mais limpos e legíveis
- Exemplo: `import { Button } from '@/components/ui'`

## 📝 Como Usar

### Importando Componentes UI
```typescript
import { Button, Input, Card } from '@/components/ui'
```

### Importando Server Actions
```typescript
import { createPrompt, updatePrompt } from '@/features/admin'
import { signIn, signOut } from '@/features/auth'
```

### Importando Types
```typescript
import type { User, Prompt, Category } from '@/types'
```

### Importando Hooks
```typescript
import { useAuth } from '@/hooks'
```

### Importando Constants
```typescript
import { SITE_CONFIG, NAVIGATION } from '@/constants'
```

## 🔄 Próximos Passos Sugeridos

1. **Mover components de features para `components/`** quando apropriado
2. **Criar tests** para novos components UI
3. **Documentar** cada feature no seu diretório
4. **Implementar database** nas server actions (atualmente com TODOs)
5. **Adicionar mais components UI** conforme necessidade (Dialog, Toast, etc.)

## 📚 Referências

- [Next.js App Router](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/)
