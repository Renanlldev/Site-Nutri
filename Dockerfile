# ==============================================================================
# Dockerfile Multi-Stage para Next.js (Otimizado para Easypanel / VPS)
# Imagem final ultra-leve (~150MB) usando Next.js Standalone Mode
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Base Image
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base

# Dependência libc6-compat necessária para compatibilidade com certas libs nativas no Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ------------------------------------------------------------------------------
# 2. Dependencies Stage (Cache de Dependências)
# ------------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copiar arquivos de definição de pacotes
COPY package.json package-lock.json ./

# Instalar dependências exatas com npm ci
RUN npm ci

# ------------------------------------------------------------------------------
# 3. Builder Stage (Compilação do Next.js)
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Argumentos de build para variáveis públicas do Supabase (Client Bundle)
ARG NEXT_PUBLIC_SUPABASE_URL=https://fqpliorgldtrbifelnht.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_J69m7Nx5oE1UhbK8oJ8wkA_t6w6b9Nn

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compila o projeto gerando o output standalone em .next/standalone
RUN npm run build

# ------------------------------------------------------------------------------
# 4. Runner Stage (Imagem de Produção Mínima)
# ------------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Criar usuário não-root por segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar arquivos públicos e estáticos
COPY --from=builder /app/public ./public

# Copiar build standalone e estáticos compilados
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Usar o usuário restrito
USER nextjs

EXPOSE 3000

# Executar o servidor nativo gerado pelo Next.js
CMD ["node", "server.js"]
