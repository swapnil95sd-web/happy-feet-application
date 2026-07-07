-- StudioFlow multi-studio foundation.
-- Run this in Supabase SQL Editor when you are ready to turn Happy Feet into the
-- first client/studio inside the reusable Dance Studio Platform.

create extension if not exists "pgcrypto";

create table if not exists public.studios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  status text not null default 'active' check (status in ('active', 'inactive', 'trial')),
  primary_color text default '#c0185a',
  secondary_color text default '#3a1f3a',
  logo_url text,
  contact_email text,
  contact_phone text,
  payment_label text default 'Venmo',
  payment_handle text,
  custom_domain text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.studio_members (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('owner', 'admin', 'instructor', 'student')),
  status text not null default 'active' check (status in ('active', 'invited', 'inactive')),
  created_at timestamptz default now(),
  unique (studio_id, email)
);

insert into public.studios (
  slug,
  name,
  contact_email,
  contact_phone,
  payment_handle
)
values (
  'happy-feet',
  'Happy Feet Dance Academy',
  'hello@happyfeetnycnj.com',
  '(555) 123-4567',
  '@HappyFeetNYCNJ'
)
on conflict (slug) do update set
  name = excluded.name,
  updated_at = now();

do $$
declare
  happy_feet_id uuid;
begin
  select id into happy_feet_id from public.studios where slug = 'happy-feet';

  alter table public.profiles add column if not exists studio_id uuid references public.studios(id) on delete set null;
  alter table public.instructors add column if not exists studio_id uuid references public.studios(id) on delete cascade;
  alter table public.classes add column if not exists studio_id uuid references public.studios(id) on delete cascade;
  alter table public.bookings add column if not exists studio_id uuid references public.studios(id) on delete cascade;
  alter table public.announcements add column if not exists studio_id uuid references public.studios(id) on delete cascade;
  alter table public.practice_videos add column if not exists studio_id uuid references public.studios(id) on delete cascade;
  alter table public.site_content add column if not exists studio_id uuid references public.studios(id) on delete cascade;
  alter table public.gallery_images add column if not exists studio_id uuid references public.studios(id) on delete cascade;

  update public.profiles set studio_id = happy_feet_id where studio_id is null;
  update public.instructors set studio_id = happy_feet_id where studio_id is null;
  update public.classes set studio_id = happy_feet_id where studio_id is null;
  update public.bookings set studio_id = happy_feet_id where studio_id is null;
  update public.announcements set studio_id = happy_feet_id where studio_id is null;
  update public.practice_videos set studio_id = happy_feet_id where studio_id is null;
  update public.site_content set studio_id = happy_feet_id where studio_id is null;
  update public.gallery_images set studio_id = happy_feet_id where studio_id is null;
end $$;

alter table public.site_content drop constraint if exists site_content_pkey;

create unique index if not exists site_content_studio_key_idx
on public.site_content (studio_id, key);

create index if not exists profiles_studio_id_idx on public.profiles (studio_id);
create index if not exists instructors_studio_id_idx on public.instructors (studio_id);
create index if not exists classes_studio_id_idx on public.classes (studio_id);
create index if not exists bookings_studio_id_idx on public.bookings (studio_id);
create index if not exists announcements_studio_id_idx on public.announcements (studio_id);
create index if not exists practice_videos_studio_id_idx on public.practice_videos (studio_id);
create index if not exists gallery_images_studio_id_idx on public.gallery_images (studio_id);

create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_studio_role(target_studio_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (
      select role
      from public.studio_members
      where studio_id = target_studio_id
        and (
          user_id = auth.uid()
          or lower(email) = lower(coalesce((select email from auth.users where id = auth.uid()), ''))
        )
        and status = 'active'
      limit 1
    ),
    case when public.current_profile_role() = 'admin' then 'owner' end
  )
$$;

alter table public.studios enable row level security;
alter table public.studio_members enable row level security;

drop policy if exists "Anyone can read active studios" on public.studios;
create policy "Anyone can read active studios"
on public.studios for select
using (status = 'active');

drop policy if exists "Studio admins manage their studio" on public.studios;
create policy "Studio admins manage their studio"
on public.studios for update
using (public.current_studio_role(id) in ('owner', 'admin'))
with check (public.current_studio_role(id) in ('owner', 'admin'));

drop policy if exists "Studio admins read members" on public.studio_members;
create policy "Studio admins read members"
on public.studio_members for select
using (public.current_studio_role(studio_id) in ('owner', 'admin'));

drop policy if exists "Studio owners manage members" on public.studio_members;
create policy "Studio owners manage members"
on public.studio_members for all
using (public.current_studio_role(studio_id) = 'owner')
with check (public.current_studio_role(studio_id) = 'owner');

-- Replace this email with the real owner/admin email for Anitha before running,
-- or run a separate insert after this script.
insert into public.studio_members (studio_id, user_id, email, role, status)
select studios.id, profiles.id, profiles.email, 'owner', 'active'
from public.studios
join public.profiles on profiles.role = 'admin'
where studios.slug = 'happy-feet'
on conflict (studio_id, email) do update set role = 'owner', status = 'active';

drop policy if exists "Studio admins manage instructors" on public.instructors;
create policy "Studio admins manage instructors"
on public.instructors for all
using (public.current_studio_role(studio_id) in ('owner', 'admin'))
with check (public.current_studio_role(studio_id) in ('owner', 'admin'));

drop policy if exists "Studio admins manage classes" on public.classes;
create policy "Studio admins manage classes"
on public.classes for all
using (public.current_studio_role(studio_id) in ('owner', 'admin'))
with check (public.current_studio_role(studio_id) in ('owner', 'admin'));

drop policy if exists "Studio admins manage bookings" on public.bookings;
create policy "Studio admins manage bookings"
on public.bookings for all
using (public.current_studio_role(studio_id) in ('owner', 'admin'))
with check (public.current_studio_role(studio_id) in ('owner', 'admin'));

drop policy if exists "Studio admins manage announcements" on public.announcements;
create policy "Studio admins manage announcements"
on public.announcements for all
using (public.current_studio_role(studio_id) in ('owner', 'admin'))
with check (public.current_studio_role(studio_id) in ('owner', 'admin'));

drop policy if exists "Studio admins manage practice videos" on public.practice_videos;
create policy "Studio admins manage practice videos"
on public.practice_videos for all
using (public.current_studio_role(studio_id) in ('owner', 'admin'))
with check (public.current_studio_role(studio_id) in ('owner', 'admin'));

drop policy if exists "Studio admins manage site content" on public.site_content;
create policy "Studio admins manage site content"
on public.site_content for all
using (public.current_studio_role(studio_id) in ('owner', 'admin'))
with check (public.current_studio_role(studio_id) in ('owner', 'admin'));

drop policy if exists "Studio admins manage gallery images" on public.gallery_images;
create policy "Studio admins manage gallery images"
on public.gallery_images for all
using (public.current_studio_role(studio_id) in ('owner', 'admin'))
with check (public.current_studio_role(studio_id) in ('owner', 'admin'));
