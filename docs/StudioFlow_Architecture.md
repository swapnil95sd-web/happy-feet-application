# StudioFlow Architecture

## Product Vision

StudioFlow is a reusable dance studio management platform. Happy Feet NYC/NJ is the first branded implementation of the platform.

The goal is to create a professional web application where a studio owner can manage the website, classes, bookings, students, instructors, announcements, videos, payments, and attendance without touching code.

## Core Principle

Build the platform first. Brand it for Happy Feet second.

## Current Client

Client: Happy Feet Dance Academy NYC/NJ
Director: Anitha Prakash
Primary Use Case: Public website, class booking, admin CMS, student portal, instructor portal

## Technology Stack

Frontend:

* React
* Vite
* TypeScript
* Tailwind CSS

Backend:

* API layer for protected business logic
* Supabase for auth, database, and storage

Database:

* Supabase Postgres

Authentication:

* Supabase Auth

Storage:

* Supabase Storage

Hosting:

* Vercel

## User Roles

### Admin

Can manage everything:

* Website content
* Classes
* Instructors
* Students
* Bookings
* Payments
* Announcements
* Practice videos
* Gallery
* Attendance
* Platform settings

### Instructor

Can manage assigned classes:

* View assigned classes
* View class rosters
* Add practice videos
* Add class announcements
* Mark attendance

### Student

Can access only their own information:

* My classes
* Bookings
* Payment status
* Practice videos
* Announcements
* Showcase information
* Profile

## Main Modules

### Public Website

Marketing-facing website with editable content:

* Homepage
* Classes
* About
* Instructors
* Gallery
* Testimonials
* Contact
* Booking CTA

### Booking Engine

Allows students to:

* Browse classes
* Select a class
* Submit registration
* View Venmo payment instructions
* Receive confirmation

### Admin CMS

Allows admin to edit:

* Homepage text
* Hero images
* Class images
* About section
* Testimonials
* Gallery
* Contact info
* Social links
* Venmo details
* Announcement banner

### Class Management

Admin can:

* Add classes
* Edit classes
* Delete or deactivate classes
* Update images
* Set price, schedule, location, capacity, instructor, level, age group, and status

### Student Portal

Students can:

* View enrolled classes
* View announcements
* Watch practice videos
* See payment status
* Access showcase details

### Instructor Portal

Instructors can:

* View assigned classes
* View rosters
* Upload/paste practice video links
* Post announcements
* Mark attendance

### Payments

Initial version:

* Venmo payment instructions
* Admin manually marks payment status

Future version:

* Stripe checkout
* Automated receipts
* Refund tracking

### Media Library

Admin can upload/manage:

* Class images
* Hero images
* Gallery images
* Instructor profile photos
* Venmo QR code

## Database Tables

Core tables:

* profiles
* instructors
* classes
* bookings
* payments
* announcements
* practice_videos
* attendance
* gallery_images
* site_content
* platform_settings

## Security Rules

* Students cannot access admin routes.
* Students cannot access other students’ data.
* Instructors can only access assigned class data.
* Admin access is granted only through approved role assignment.
* Role checks must exist in both frontend routing and backend/database policies.

## Brand Layer

Happy Feet-specific branding should live in content/settings, not hardcoded everywhere.

Brandable items:

* Logo
* Colors
* Typography
* Studio name
* Contact info
* Venmo handle
* Homepage copy
* Images
* Social links

## Development Phases

### Phase 1: Foundation

* Define architecture
* Add Supabase client
* Replace Replit Auth
* Add role-based auth
* Confirm Vercel deployment
* Stabilize project structure

### Phase 2: CMS

* Website content editor
* Class editor
* Image uploads
* Gallery manager
* Announcements manager
* Video manager

### Phase 3: Student Experience

* Booking flow
* Student dashboard
* Payment status
* Practice videos
* Showcase hub

### Phase 4: Instructor Experience

* Instructor dashboard
* Assigned classes
* Roster view
* Attendance
* Videos and announcements

### Phase 5: Polish

* Premium UI
* Animations
* Mobile optimization
* SEO
* Email confirmations
* Custom domain
