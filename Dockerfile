# ─────────────────────────────────────────────────────────────────────────────
# Green Clean Group — Production Dockerfile (multi-stage, Next.js standalone)
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl openssl-dev
WORKDIR /app

COPY package.json package-lock.json ./
# Copy Prisma schema so postinstall / prisma generate can find it
COPY prisma ./prisma/

RUN npm ci

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl openssl-dev
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client for the Linux/Alpine target
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1

# Build creates .next/standalone when output: 'standalone' is set
RUN npm run build

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

# Static assets
COPY --from=builder /app/public ./public

# Standalone server (Next.js traces only required files)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma client (needed at runtime)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Seed script + data (needed at startup to seed the DB)
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/data ./data

# Prisma CLI binary (for migrate deploy at startup)
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

USER nextjs

EXPOSE 3000

# Run DB schema sync, seed data, then start the server
CMD ["sh", "-c", "node_modules/.bin/prisma db push --accept-data-loss && node scripts/seed-db.js && node server.js"]
