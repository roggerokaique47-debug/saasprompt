FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Instalar dependências globais
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copiar os packages e a aplicação web
COPY apps/web ./apps/web
COPY packages ./packages

# Instalar dependências
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Expor a porta 3000
EXPOSE 3000

# Rodar no modo desenvolvimento (pode ser trocado para start em prod)
CMD ["pnpm", "--filter", "@prompthub/web", "dev"]
