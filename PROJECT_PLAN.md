# Happy Feet Studio Platform

## Goal
Build a polished dance studio web application for Happy Feet NYC/NJ with public website, class booking, admin CMS, student portal, instructor portal, database, authentication, and image/video management.

## Architecture
- Frontend: React + Vite
- Hosting: Vercel
- Database: Supabase Postgres
- Auth: Supabase Auth
- Storage: Supabase Storage
- Backend/API: Express or Vercel API routes
- Admin CMS: built into the app

## App Roles
- Admin: full access
- Instructor: assigned classes, rosters, videos, announcements, attendance
- Student: own classes, videos, announcements, payment status

## Phase 1: Foundation
- Remove Replit-only auth/dependencies
- Connect Supabase Auth
- Connect Supabase database
- Add user roles
- Secure admin/student routes
- Confirm Vercel deployment works

## Phase 2: CMS
- Editable homepage content
- Editable class images
- Add/edit/delete classes
- Announcements
- Practice videos
- Gallery
- Contact/social/payment settings

## Phase 3: Booking + Student Portal
- Class booking flow
- Venmo payment instructions
- Payment status tracking
- Student dashboard
- Practice videos
- Showcase information

## Phase 4: Instructor Portal
- Assigned classes
- Rosters
- Attendance
- Class announcements
- Practice video links

## Phase 5: Polish
- Better UI/copy
- Mobile improvements
- Email confirmations
- Custom domain
