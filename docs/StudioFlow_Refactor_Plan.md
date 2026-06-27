# StudioFlow Refactor Plan

## Current Structure

- `artifacts/happy-feet`: Vite/React public website, booking UI, student portal, and admin UI for the Happy Feet client.
- `artifacts/api-server`: Express/Drizzle API server generated from the original Replit app.
- `artifacts/mockup-sandbox`: Replit mockup preview app retained as a separate artifact.
- `lib/api-client-react` and `lib/api-zod`: generated API client/schema packages for the old API layer.
- `lib/db`: Drizzle schema for the original API server.
- `lib/replit-auth-web`: legacy Replit Auth frontend package. It is no longer referenced by the Happy Feet frontend.
- `docs`: architecture and planning documents.
- `vercel.json`: Vercel build configuration for `artifacts/happy-feet`.

## Target Structure

- Keep `artifacts/happy-feet` as the first StudioFlow client shell, branded for Happy Feet.
- Move reusable platform logic into clear frontend modules under `src/lib`, then later extract shared platform modules as needed.
- Use Supabase Auth for sessions and `public.profiles.role` for authorization.
- Use Supabase tables directly for v1 CMS and booking foundation:
  - `profiles`
  - `classes`
  - `bookings`
  - `announcements`
  - `practice_videos`
  - `site_content`
  - `gallery_images`
- Keep demo fallback data for public pages when Supabase env vars are missing.
- Retire Replit-only frontend dependencies from the production Happy Feet app.

## Completed Changes

- Added Supabase browser client setup using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Added Supabase auth provider and `useAuth` hook.
- Added `profiles.role` lookup for `admin`, `instructor`, and `student`.
- Kept `VITE_ADMIN_EMAIL` only as first-admin bootstrap fallback when a profile role is missing.
- Replaced Happy Feet frontend usage of `@workspace/replit-auth-web`.
- Protected `/portal` behind login.
- Protected `/admin` behind the `admin` role.
- Removed Replit-only Vite plugins from the Happy Feet frontend build.
- Added a StudioFlow data layer that reads from Supabase when configured and keeps demo fallback data when not configured.
- Updated homepage class listing to use Supabase classes with fallback classes.
- Updated homepage content to read `site_content` key `homepage`.
- Updated public booking flow so selected class details carry into booking and create a `bookings` record with `payment_status = pending`.
- Moved Venmo handle to homepage CMS content.
- Replaced the admin screen with a StudioFlow CMS foundation:
  - homepage content
  - classes add/edit/deactivate
  - bookings and payment status updates
  - announcements add/edit status foundation
  - practice videos with class assignment
  - gallery image URL management
- Added macOS native package allowance in pnpm overrides so local Vite/Rollup builds can run while keeping deployment-oriented pruning.

## Risks

- Supabase table column names may differ from the exact schema in production. The frontend maps common `snake_case` and legacy names where possible, but save operations assume canonical StudioFlow column names.
- Admin writes rely on Supabase RLS policies allowing admin users to manage CMS tables.
- The API server and generated clients still exist for legacy routes and portal data; they should be retired or refactored after the Supabase tables are fully validated.
- Student portal still uses the older generated API demo data pattern and should be moved to authenticated Supabase student-specific queries next.
- Image upload currently accepts/stores URLs. Supabase Storage upload UI remains a follow-up.

## Migration Plan

1. Confirm Supabase table columns match the StudioFlow field names used in `artifacts/happy-feet/src/lib/studioflow.ts`.
2. Add or adjust RLS policies from `docs/Supabase_RLS_Policies.md`.
3. Seed `site_content` with key `homepage` and the content JSON shape documented in the data layer.
4. Seed or migrate `classes` records with `status`, `featured`, `image_url`, schedule, price, and capacity fields.
5. Add admin profile rows with `role = 'admin'`.
6. Validate public browsing and booking against Supabase.
7. Move student portal data from the old API client to Supabase bookings/classes/practice videos.
8. Add Supabase Storage upload controls for class, instructor, gallery, and site images.
9. Remove unused legacy API/auth packages once all active screens are on Supabase.

## Remaining Work

- Implement instructor dashboard routes and instructor-scoped queries.
- Complete student portal Supabase migration.
- Add Supabase Storage uploads, not only image URL fields.
- Add richer validation and typed generated Supabase schema.
- Add end-to-end tests for auth guards, booking, and admin CMS writes.
- Consider code-splitting admin/dashboard code to reduce the main frontend bundle size.
