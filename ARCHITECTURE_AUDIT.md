# Architecture Audit

## Current Structure

### Frontend
Path: `artifacts/happy-feet`

Purpose:
- Public website
- Student portal
- Admin portal
- React/Vite UI

Status:
- Keep as main frontend foundation.
- Needs Replit Auth removed.
- Needs Supabase Auth added.
- Needs CMS-driven content instead of hardcoded content.

### Backend
Path: `artifacts/api-server`

Purpose:
- Express API routes
- Classes
- Students
- Enrollments
- Announcements
- Videos
- Dashboard

Status:
- Keep backend concept.
- Replace Replit-specific auth.
- Add role-based authorization.
- Connect to Supabase Postgres.
- Add API routes for CMS, uploads, payments, attendance.

### Database Layer
Path: `lib/db`

Purpose:
- Drizzle schema
- Existing tables: users, classes, students, enrollments, announcements, videos

Status:
- Keep Drizzle or migrate directly to Supabase SQL.
- Current schema is a good starter but incomplete.

### Replit Auth
Path: `lib/replit-auth-web`

Status:
- Remove/replace.
- Use Supabase Auth instead.

## Target Architecture

- Frontend: React + Vite
- Backend: Express API or Vercel API routes
- Auth: Supabase Auth
- Database: Supabase Postgres
- Storage: Supabase Storage
- Hosting: Vercel
- Roles: admin, instructor, student

## Core Product Modules

1. Public Website
2. Booking Flow
3. Admin CMS
4. Student Portal
5. Instructor Portal
6. Class Management
7. Payments / Venmo Tracking
8. Practice Videos
9. Announcements
10. Gallery / Media Library
11. Attendance
12. Platform Settings

## Phase 1 Refactor Priorities

1. Remove Replit Auth dependency
2. Add Supabase client
3. Add users/roles model
4. Protect admin routes
5. Protect instructor routes
6. Make Vercel deployment stable
7. Add database schema foundation
