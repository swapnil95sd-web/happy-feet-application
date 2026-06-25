---
name: Replit Auth setup
description: Notes on how auth was wired into this project, and a tsconfig gotcha for replit-auth-web.
---

# Replit Auth — project-specific wiring

## What's set up
- `lib/db/src/schema/auth.ts` — sessionsTable + usersTable (copied from template, exported in schema/index.ts)
- `artifacts/api-server/src/lib/auth.ts` — session CRUD + OIDC config
- `artifacts/api-server/src/middlewares/authMiddleware.ts` — patches req.user + req.isAuthenticated()
- `artifacts/api-server/src/routes/auth.ts` — /auth/user, /login, /callback, /logout, /mobile-auth/*
- `lib/replit-auth-web/` — browser useAuth() hook, used in frontend
- Admin guard: requires auth + optional VITE_ADMIN_EMAIL env check (if set, only matching email gets admin)
- Portal guard: requires any authenticated user

## tsconfig gotcha for replit-auth-web
The template tsconfig for lib/replit-auth-web is missing composite settings and vite/client types. Must add:
```json
{
  "composite": true,
  "declarationMap": true,
  "emitDeclarationOnly": true,
  "types": ["vite/client"]
}
```
And add `"vite": "catalog:"` to devDependencies in replit-auth-web/package.json.

**Why:** The lib is referenced from the root tsconfig.json (composite libs), and use-auth.ts uses import.meta.env.BASE_URL which requires vite/client types.

**How to apply:** Any time this lib is freshly copied from the template, apply these patches before running codegen.

## Admin protection pattern
- `VITE_ADMIN_EMAIL` env var → set to Anitha's Replit account email
- If unset: any logged-in user can access admin (useful during development)
- If set: non-matching emails see "Access denied" screen
