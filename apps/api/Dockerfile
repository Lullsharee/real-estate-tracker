FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database/package.json packages/database/
COPY packages/types/package.json packages/types/
COPY packages/mlit-client/package.json packages/mlit-client/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @real-estate-tracker/database exec prisma generate
RUN pnpm --filter @real-estate-tracker/api build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/packages/database/node_modules/.pnpm/@prisma+client*/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/index.js"]
