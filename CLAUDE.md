# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Japanese real estate price tracker — visualizes transaction data from the MLIT (Ministry of Land, Infrastructure, Transport and Tourism) API for Tokyo, Kanagawa, and Saitama prefectures.

## Monorepo Structure

Turborepo with pnpm workspaces:

- **apps/api** — Hono REST API server (port 3001), handles data collection from MLIT API, statistics calculation, and serves endpoints
- **apps/web** — Next.js 16 frontend with App Router, displays dashboard with table/chart/map views
- **packages/database** — Prisma ORM with SQLite, exports singleton client
- **packages/types** — Shared TypeScript type definitions
- **packages/mlit-client** — MLIT API client with rate limiting (1000ms between requests)

## Common Commands

```bash
pnpm install                # Install all dependencies
pnpm dev                    # Start all dev servers (API + Web)
pnpm build                  # Build all packages (respects dependency order)
pnpm test                   # Run all tests (Vitest)
pnpm lint                   # Lint all packages

# Database
pnpm db:generate            # Generate Prisma client types
pnpm db:push                # Push schema to SQLite

# API-specific
pnpm --filter @real-estate-tracker/api run collect    # Run data collection without server
pnpm --filter @real-estate-tracker/api test           # Run API tests only
pnpm --filter @real-estate-tracker/api test:watch     # Watch mode

# Web-specific
pnpm --filter @real-estate-tracker/web dev            # Run frontend only
pnpm --filter @real-estate-tracker/web lint           # Lint frontend only
```

## Architecture

### Data Flow

1. MLIT API → `collector.ts` fetches last 4 quarters of trade data per prefecture
2. Raw properties stored in `Property` table (BigInt for `tradePrice` to handle values up to ~4.2B yen)
3. `stats.ts` aggregates into `PropertyStats` (avg/median price per period/prefecture/municipality) via upsert
4. Frontend queries REST endpoints with optional prefecture/municipality filters

### API Endpoints (apps/api/src/app.ts)

- `POST /api/collect` — trigger data collection
- `GET /api/stats` — current statistics (filterable)
- `GET /api/stats/history` — time series data
- `GET /api/properties` — paginated property listings
- `GET /api/prefectures` and `GET /api/municipalities` — filter options

### Frontend (apps/web)

- Single dashboard page (`src/app/page.tsx`, client component) with three tabs: table, chart, map
- Custom hooks in `src/hooks/useStats.ts` handle data fetching via `src/lib/api.ts`
- Map uses React-Leaflet with dynamic import (no SSR) and hardcoded coordinates for 13 major cities
- Price formatting uses Japanese notation (億 for 100M, 万 for 10K)

### Key Patterns

- **BigInt handling**: `tradePrice` and `tradePricePerTsubo` are BigInt in Prisma; must convert to Number before arithmetic in stats calculations
- **Tsubo conversion**: area ÷ 3.30579 to convert m² to tsubo
- **Duplicate properties**: silently ignored on insert (caught error)
- **Scheduler**: cron runs quarterly (1st of Jan/Apr/Jul/Oct at 3AM), controlled by `ENABLE_SCHEDULER` env var

## Environment Variables

**API** (`apps/api/.env`):
- `MLIT_API_KEY` — required, MLIT API subscription key (header: `Ocp-Apim-Subscription-Key`)
- `PORT` — optional, defaults to 3001
- `DATABASE_URL` — optional, defaults to `file:./dev.db`
- `ENABLE_SCHEDULER` — optional, defaults to true

**Web** (`apps/web/.env.local`):
- `NEXT_PUBLIC_API_URL` — API base URL (e.g., `http://localhost:3001`)

## Testing

Tests use Vitest. Test files are colocated in `__tests__/` directories:
- `apps/api/src/__tests__/` — API endpoint and stats utility tests
- `packages/mlit-client/src/__tests__/` — MLIT client tests

## Docker

```bash
export MLIT_API_KEY=xxx
docker-compose up --build    # Runs API (3001) + Web (3000)
```

SQLite data persists via volume mount at `./data:/app/data`.
