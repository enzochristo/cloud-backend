# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app

# 1. ESSENCIAL: O Prisma Client em Alpine Linux exige a libc6-compat para rodar os binários do Query Engine
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000

# 2. ESSENCIAL: Comando para rodar migrations automaticamente antes de subir o servidor
CMD ["sh", "-c", "echo DATABASE_URL=$DATABASE_URL && npx prisma migrate deploy && node dist/main.js"]
