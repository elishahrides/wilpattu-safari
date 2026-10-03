-- Wilpattu Luxury V2 customer-facing schema
create table if not exists public.safari_bookings(
 id uuid primary key default gen_random_uuid(),
 reference text unique not null,
 experience text not null,
 safari_date date not null,
 guests int not null default 1,
 pickup text,
 customer_name text not null,
 whatsapp text not null,
 notes text,
 status text not null default 'pending',
 created_at timestamptz not null default now()
);
alter table public.safari_bookings enable row level security;
drop policy if exists "Public can create safari bookings" on public.safari_bookings;
create policy "Public can create safari bookings" on public.safari_bookings for insert to anon,authenticated with check (true);

create table if not exists public.traveller_stories(
 id uuid primary key default gen_random_uuid(),
 name text not null,
 rating int not null check(rating between 1 and 5),
 comment text not null,
 photo_path text,
 status text not null default 'pending',
 created_at timestamptz not null default now()
);
alter table public.traveller_stories enable row level security;
drop policy if exists "Public can submit traveller stories" on public.traveller_stories;
create policy "Public can submit traveller stories" on public.traveller_stories for insert to anon,authenticated with check (true);
drop policy if exists "Public can read approved traveller stories" on public.traveller_stories;
create policy "Public can read approved traveller stories" on public.traveller_stories for select to anon,authenticated using (status='approved');

insert into storage.buckets(id,name,public) values('traveller-stories','traveller-stories',true) on conflict(id) do nothing;
drop policy if exists "Public can upload traveller photos" on storage.objects;
create policy "Public can upload traveller photos" on storage.objects for insert to anon,authenticated with check (bucket_id='traveller-stories');
drop policy if exists "Public can view traveller photos" on storage.objects;
create policy "Public can view traveller photos" on storage.objects for select to anon,authenticated using (bucket_id='traveller-stories');

-- Optional: if an older safari_bookings table already exists, no destructive changes are made.

-- Admin dashboard access: authenticated Supabase users can read and update bookings.
drop policy if exists "Authenticated admins can view safari bookings" on public.safari_bookings;
create policy "Authenticated admins can view safari bookings" on public.safari_bookings for select to authenticated using (true);
drop policy if exists "Authenticated admins can update safari bookings" on public.safari_bookings;
create policy "Authenticated admins can update safari bookings" on public.safari_bookings for update to authenticated using (true) with check (true);
