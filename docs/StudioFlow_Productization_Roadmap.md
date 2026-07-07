# StudioFlow Productization Roadmap

StudioFlow is the reusable dance studio platform. Happy Feet is the first client studio.

## Current State

- Happy Feet public website works.
- Admin can manage homepage content, instructors, classes, bookings, announcements, videos, gallery, and uploaded images.
- Supabase stores the live client data.
- Vercel deploys from GitHub.

## Product Direction

The platform should support many studios from the same codebase:

- Each studio has branding, public content, instructors, classes, bookings, media, and payment settings.
- Each studio admin only sees their own studio.
- StudioFlow owners can create/manage studios.
- Happy Feet remains the first production studio.

## Phase 1: Multi-Studio Foundation

Implemented foundation:

- `studios` table planned in `docs/StudioFlow_Multi_Studio_Migration.sql`.
- `studio_members` table planned for per-studio roles.
- Existing core tables get `studio_id`.
- Frontend can resolve the active studio by slug, defaulting to `happy-feet`.
- Admin API receives the studio slug and scopes new writes to that studio when the migration is active.
- Existing Happy Feet behavior remains the fallback if the migration has not been run yet.

## Phase 2: Studio Owner Experience

Next:

- Add a Studio Settings tab in admin.
- Let the studio owner edit:
  - Studio name
  - Logo
  - Brand colors
  - Contact email/phone
  - Payment label/handle
  - Social links
- Replace remaining hardcoded Happy Feet public copy with editable studio content.

## Phase 3: Platform Admin

Next:

- Add a protected `/platform` area for StudioFlow operators.
- Create new studios from a form.
- Assign owner/admin emails.
- Duplicate a starter template into the new studio.
- See studio health: classes, bookings, pending payments, last admin activity.

## Phase 4: Client Onboarding

Next:

- New studio onboarding checklist.
- Starter content generator for a dance studio.
- Image upload prompts.
- Class import CSV.
- Optional custom domain setup.

## Phase 5: Production Hardening

Next:

- Move to Supabase Pro before real client load.
- Verify a Resend sending domain.
- Add Stripe or another payment provider.
- Add attendance.
- Add instructor dashboard.
- Add student portal backed entirely by Supabase.
- Add automated tests for booking and admin workflows.

