# Pepcheck

A GLP-1 compounded medication comparison platform that shows real-time pricing, vial concentrations, and jurisdiction-level legality for vetted telehealth pharmacies.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/pepcheck run dev` — run the frontend (port 20935)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui, wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — Drizzle table definitions (medications, providers, listings, stateAvailability, reviews)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/pepcheck/src/` — React frontend (pages, components)

## Architecture decisions

- OpenAPI-first: all types generated from `openapi.yaml` via Orval; never hand-write types that codegen produces
- Body schemas use entity-shaped names (`ProviderInput`, `ReviewInput`) not operation-shaped (`CreateProviderBody`) to avoid TS2308 collisions
- Featured providers route `/providers/featured` is registered before `/:id` in Express to avoid param shadowing
- State legality is stored per-provider per-state, allowing nuanced status per jurisdiction
- Reviews are flagged `verified: false` on submission; manual verification before publishing

## Product

- **Home** (`/`) — hero search by state, platform stats, featured providers strip
- **Compare** (`/compare`) — filter sidebar (state, medication, sort), provider cards, side-by-side comparison mode
- **Provider Detail** (`/providers/:id`) — pricing table by medication, state availability, reviews
- **Medications Guide** (`/medications`) — drug cards with price ranges
- **Submit Review** (`/submit-review`) — patient review submission form

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any `openapi.yaml` change, run `pnpm --filter @workspace/api-spec run codegen` before touching the frontend
- Run `pnpm --filter @workspace/db run push` after schema changes to sync the dev database
- The `providers.ts` route file registers `/providers/featured` and `/providers/compare` BEFORE `/:id` — keep this order
- The `price-range` endpoint takes `medication` as a query param (not path param) to avoid Orval `GetMedicationPriceRangeParams` TS2308 collision

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
