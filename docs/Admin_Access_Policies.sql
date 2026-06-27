-- StudioFlow / Happy Feet admin visibility and public booking policies.
-- Run this in Supabase SQL Editor after replacing the admin email if needed.

create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Make the known admin account an admin. Safe to run repeatedly.
update public.profiles
set role = 'admin', status = 'active', updated_at = now()
where id = '2d716fa1-d056-4fdb-991e-bc76beeeb468';

alter table public.profiles enable row level security;
alter table public.instructors enable row level security;
alter table public.classes enable row level security;
alter table public.bookings enable row level security;
alter table public.announcements enable row level security;
alter table public.practice_videos enable row level security;
alter table public.site_content enable row level security;
alter table public.gallery_images enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

drop policy if exists "Anyone can read active instructors" on public.instructors;
create policy "Anyone can read active instructors"
on public.instructors for select
using (coalesce(is_active, true) = true);

drop policy if exists "Admins manage instructors" on public.instructors;
create policy "Admins manage instructors"
on public.instructors for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

drop policy if exists "Anyone can read active classes" on public.classes;
create policy "Anyone can read active classes"
on public.classes for select
using (coalesce(status, 'active') = 'active');

drop policy if exists "Admins manage classes" on public.classes;
create policy "Admins manage classes"
on public.classes for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

drop policy if exists "Anyone can create a booking" on public.bookings;
create policy "Anyone can create a booking"
on public.bookings for insert
with check (true);

drop policy if exists "Admins manage bookings" on public.bookings;
create policy "Admins manage bookings"
on public.bookings for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

drop policy if exists "Anyone can read published announcements" on public.announcements;
create policy "Anyone can read published announcements"
on public.announcements for select
using (coalesce(published, true) = true);

drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements"
on public.announcements for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

drop policy if exists "Authenticated users can read practice videos" on public.practice_videos;
create policy "Authenticated users can read practice videos"
on public.practice_videos for select
using (auth.uid() is not null);

drop policy if exists "Admins manage practice videos" on public.practice_videos;
create policy "Admins manage practice videos"
on public.practice_videos for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

drop policy if exists "Anyone can read homepage content" on public.site_content;
create policy "Anyone can read homepage content"
on public.site_content for select
using (key = 'homepage');

drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content"
on public.site_content for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

drop policy if exists "Anyone can read visible gallery images" on public.gallery_images;
create policy "Anyone can read visible gallery images"
on public.gallery_images for select
using (coalesce(is_visible, true) = true);

drop policy if exists "Admins manage gallery images" on public.gallery_images;
create policy "Admins manage gallery images"
on public.gallery_images for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

-- Supabase Storage policies for local image uploads.
-- Buckets should already exist: class-images, site-images, gallery, instructor-images.
drop policy if exists "Public can view studio images" on storage.objects;
create policy "Public can view studio images"
on storage.objects for select
using (bucket_id in ('class-images', 'site-images', 'gallery', 'instructor-images'));

drop policy if exists "Admins can upload studio images" on storage.objects;
create policy "Admins can upload studio images"
on storage.objects for insert
with check (
  bucket_id in ('class-images', 'site-images', 'gallery', 'instructor-images')
  and public.current_profile_role() = 'admin'
);

drop policy if exists "Admins can update studio images" on storage.objects;
create policy "Admins can update studio images"
on storage.objects for update
using (
  bucket_id in ('class-images', 'site-images', 'gallery', 'instructor-images')
  and public.current_profile_role() = 'admin'
);
