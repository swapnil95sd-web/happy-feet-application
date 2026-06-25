# Happy Feet Dance Academy

A full-stack web app for Happy Feet Dance Academy NYC/NJ — directed by Anitha Prakash. Students can browse classes, book online, and access a personal portal. Anitha manages everything from the admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/happy-feet run dev` — run the frontend (port 23556)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Fonts: Playfair Display (headings) + Inter (body)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/` — DB schema (classes, students, enrollments, announcements, videos)
- `artifacts/api-server/src/routes/` — Express route handlers (classes, students, enrollments, announcements, videos, dashboard)
- `artifacts/happy-feet/src/pages/` — React pages (home.tsx, portal.tsx, admin.tsx)
- `artifacts/happy-feet/src/index.css` — brand colors (rose #c0185a, plum #3a1f3a, gold #c98b2f)

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed React hooks + Zod validators
- Student portal uses demo studentId=1; auth can be added later via Clerk/Replit Auth
- Enrollments auto-create a student record if no studentId provided (public booking flow)
- Admin panel has no auth guard for now — suitable for private/trusted use until auth is added
- Classes category filtering happens server-side via query param

## Product

- **Public landing page**: Hero, stats, class listings with category filter (All/Kids/Adults/Showcase/Workshop), 3-step booking form (details → Venmo payment → confirmed)
- **Student portal**: Dashboard, My Classes, Practice Videos, Showcase Hub, Receipts
- **Admin dashboard**: Live stats, recent enrollments, weekly schedule, add class, post announcement, upload video, student roster

## User preferences

- Brand: Deep rose (#c0185a), plum (#3a1f3a), gold (#c98b2f), warm off-white (#fffaf6)
- Typography: Playfair Display for display headings, Inter for body
- No emojis in the UI

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Run `pnpm --filter @workspace/db run push` after schema changes
- CSS `@import` for Google Fonts must be the FIRST line in `index.css` (before tailwindcss import)
- The `@workspace/db` lib typecheck requires `pnpm run typecheck:libs` after schema changes

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
