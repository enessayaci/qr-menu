# Raspberry Pi 4 (ARM64) + Docker
# Pi üzerinde: docker compose up -d --build

FROM node:20-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

FROM base AS prod-deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL=file:/tmp/build.db
RUN npx prisma db push --skip-generate && npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:/app/data/prod.db

WORKDIR /app

# standalone önce; public sonra (üzerine yazılmasın)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Full production node_modules (includes Prisma CLI deps)
COPY --from=prod-deps /app/node_modules ./node_modules

COPY scripts/seed-if-empty.mjs ./scripts/seed-if-empty.mjs
COPY docker/entrypoint.sh ./docker/entrypoint.sh
RUN chmod +x ./docker/entrypoint.sh \
  && mkdir -p /app/data /app/public/uploads

EXPOSE 3000
ENTRYPOINT ["./docker/entrypoint.sh"]
