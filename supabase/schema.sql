create extension if not exists pgcrypto;

create table if not exists public.questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  household_name text not null,
  contact_name text not null,
  email text,
  phone text,
  attendance text not null check (attendance in ('yes', 'maybe', 'no')),
  estimated_guests integer not null default 0 check (estimated_guests between 0 and 20),
  guest_names text,
  hotel_interest text not null check (hotel_interest in ('yes', 'maybe', 'no')),
  rooms_needed integer not null default 0 check (rooms_needed between 0 and 10),
  hotel_nights text[] not null default '{}',
  transportation_interest boolean not null default false,
  dietary_restrictions text,
  allergies text,
  accessibility_needs text,
  mailing_address text,
  notes text
);

alter table public.questionnaire_responses enable row level security;

-- No public policies are intentionally created.
-- The browser never talks directly to Supabase. Next.js server routes use the
-- service-role key, while RLS blocks anonymous direct reads/writes.
