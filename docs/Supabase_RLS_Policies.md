# Supabase RLS Policies

These policies assume `public.profiles` has:

- `id uuid primary key references auth.users(id)`
- `role text check (role in ('admin', 'instructor', 'student'))`

Create a helper function first:

```sql
create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;
```

## Profiles

```sql
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
using (id = auth.uid());

create policy "Admins can read all profiles"
on public.profiles for select
using (public.current_profile_role() = 'admin');

create policy "Admins can update profiles"
on public.profiles for update
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');
```

## Public Content

```sql
alter table public.site_content enable row level security;
alter table public.classes enable row level security;
alter table public.announcements enable row level security;
alter table public.gallery_images enable row level security;

create policy "Anyone can read homepage content"
on public.site_content for select
using (key = 'homepage');

create policy "Anyone can read active classes"
on public.classes for select
using (coalesce(status, 'active') = 'active');

create policy "Anyone can read published announcements"
on public.announcements for select
using (coalesce(status, 'published') = 'published' or coalesce(published, false) = true);

create policy "Anyone can read published gallery images"
on public.gallery_images for select
using (coalesce(status, 'published') = 'published');
```

## Admin CMS Writes

```sql
create policy "Admins manage site content"
on public.site_content for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

create policy "Admins manage classes"
on public.classes for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

create policy "Admins manage announcements"
on public.announcements for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

create policy "Admins manage gallery images"
on public.gallery_images for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');
```

## Bookings

```sql
alter table public.bookings enable row level security;

create policy "Anyone can create a booking"
on public.bookings for insert
with check (true);

create policy "Admins can read bookings"
on public.bookings for select
using (public.current_profile_role() = 'admin');

create policy "Admins can update booking payment status"
on public.bookings for update
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

create policy "Students can read their own bookings by email"
on public.bookings for select
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and lower(profiles.email) = lower(bookings.email)
  )
);
```

## Practice Videos

```sql
alter table public.practice_videos enable row level security;

create policy "Admins manage practice videos"
on public.practice_videos for all
using (public.current_profile_role() = 'admin')
with check (public.current_profile_role() = 'admin');

create policy "Instructors can manage videos"
on public.practice_videos for all
using (public.current_profile_role() in ('admin', 'instructor'))
with check (public.current_profile_role() in ('admin', 'instructor'));

create policy "Authenticated students can read practice videos"
on public.practice_videos for select
using (auth.uid() is not null);
```

## Storage Buckets

For `class-images`, `site-images`, `gallery`, and `instructor-images`:

```sql
create policy "Public can view studio images"
on storage.objects for select
using (bucket_id in ('class-images', 'site-images', 'gallery', 'instructor-images'));

create policy "Admins can upload studio images"
on storage.objects for insert
with check (
  bucket_id in ('class-images', 'site-images', 'gallery', 'instructor-images')
  and public.current_profile_role() = 'admin'
);

create policy "Admins can update studio images"
on storage.objects for update
using (
  bucket_id in ('class-images', 'site-images', 'gallery', 'instructor-images')
  and public.current_profile_role() = 'admin'
);
```

Review these before production if instructors should only see assigned classes. That requires an `instructor_class_assignments` table and policies joined through that assignment table.
