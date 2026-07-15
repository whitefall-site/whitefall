-- WHITEFALL waitlist — Supabase one-time setup
-- Run this once: Supabase dashboard → SQL Editor → New query → paste all → Run.
--
-- Design: the tables are NOT directly readable or writable from the website.
-- The site only calls the three functions below. Visitors can add themselves
-- to the list; only someone with the owner passcode can read the list.

create table if not exists public.signups (
  id bigint generated always as identity primary key,
  email text not null unique,
  num bigint unique,
  interests text[] not null default '{}',
  size text,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value text not null
);

-- The owner-panel passcode. CHANGE THIS after setup (see README) — treat it
-- like a password, since anyone on the internet can attempt codes.
insert into public.settings (key, value) values ('owner_code', '0623')
  on conflict (key) do nothing;

alter table public.signups enable row level security;
alter table public.settings enable row level security;
revoke all on table public.signups from anon, authenticated;
revoke all on table public.settings from anon, authenticated;

-- Add (or update) a signup. Returns the member number, assigned in signup
-- order — the first 100 are founding members.
create or replace function public.join_waitlist(p_email text, p_interests text[] default '{}')
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_num bigint;
begin
  p_email := lower(trim(p_email));
  if p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid email';
  end if;
  select num into v_num from signups where email = p_email;
  if found then
    update signups
      set interests = (select coalesce(array_agg(distinct i), '{}') from unnest(interests || p_interests) as i)
      where email = p_email;
    return v_num;
  end if;
  -- serialize number assignment so two simultaneous signups can't get the same number
  perform pg_advisory_xact_lock(20261001);
  insert into signups (email, num, interests)
    values (p_email, (select coalesce(max(num), 0) + 1 from signups), p_interests)
    returning num into v_num;
  return v_num;
end;
$$;

-- Record the size a member picked after joining.
create or replace function public.set_size(p_email text, p_size text)
returns void
language sql
security definer
set search_path = public
as $$
  update signups set size = upper(trim(p_size))
  where email = lower(trim(p_email))
    and upper(trim(p_size)) in ('XS','S','M','L','XL','XXL');
$$;

-- Owner panel: returns the full list only when the passcode matches.
create or replace function public.list_signups(p_code text)
returns setof public.signups
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from settings where key = 'owner_code' and value = p_code) then
    raise exception 'wrong passcode';
  end if;
  return query select * from signups order by created_at desc;
end;
$$;

grant execute on function public.join_waitlist(text, text[]) to anon;
grant execute on function public.set_size(text, text) to anon;
grant execute on function public.list_signups(text) to anon;
