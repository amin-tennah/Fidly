-- ============================================================================
-- Migration 2 (Étape 2.3) : Tables métier, contraintes, index & activation RLS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

-- 1. Restaurants
create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(trim(name)) between 1 and 120),
  category public.restaurant_category not null default 'other',
  address text,
  location extensions.geography(Point, 4326),
  logo_path text,
  opening_hours jsonb not null default '{}'::jsonb,
  subscription_status public.subscription_status not null default 'trialing',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.restaurants enable row level security;

create trigger set_restaurants_updated_at
  before update on public.restaurants
  for each row execute function public.set_updated_at();

create index restaurants_location_gist_idx
  on public.restaurants using gist (location);

create index restaurants_category_active_idx
  on public.restaurants (category)
  where is_active = true;

-- 2. Profiles (1-1 avec auth.users, cf. ADR-005 & Q-010)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (
    display_name is null
    or char_length(trim(display_name)) between 1 and 60
  ),
  qr_token text not null unique check (char_length(qr_token) >= 32),
  short_code text not null unique check (
    short_code ~ '^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$'
  ),
  signup_restaurant_id uuid references public.restaurants (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create index profiles_signup_restaurant_id_idx
  on public.profiles (signup_restaurant_id);

-- 3. Platform Admins (super-admins Fidly, cf. ADR-006)
create table public.platform_admins (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.platform_admins enable row level security;

-- 4. Restaurant Members (multi-staff owner/staff, cf. ADR-006)
create table public.restaurant_members (
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.restaurant_member_role not null default 'staff',
  created_at timestamptz not null default now(),
  primary key (restaurant_id, user_id)
);

alter table public.restaurant_members enable row level security;

create index restaurant_members_user_id_idx
  on public.restaurant_members (user_id);

-- 5. Restaurant Invitations (onboarding pro sur invitation, cf. ADR-006)
create table public.restaurant_invitations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  email text not null check (char_length(trim(email)) > 3),
  role public.restaurant_member_role not null default 'owner',
  invited_by uuid references public.profiles (id) on delete set null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.restaurant_invitations enable row level security;

create index restaurant_invitations_restaurant_id_idx
  on public.restaurant_invitations (restaurant_id);

create index restaurant_invitations_invited_by_idx
  on public.restaurant_invitations (invited_by);

create index restaurant_invitations_lower_email_idx
  on public.restaurant_invitations (lower(email));

-- 6. Loyalty Programs (paliers de récompense d'un restaurant, cf. ADR-009)
create table public.loyalty_programs (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  position integer not null check (position > 0),
  threshold integer not null check (threshold > 0),
  reward_label text not null check (char_length(trim(reward_label)) between 1 and 140),
  reward_image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, position)
);

alter table public.loyalty_programs enable row level security;

create trigger set_loyalty_programs_updated_at
  before update on public.loyalty_programs
  for each row execute function public.set_updated_at();

create index loyalty_programs_restaurant_id_idx
  on public.loyalty_programs (restaurant_id);

-- 7. Loyalty Cards (progression cumulée par cycle, cf. ADR-009)
create table public.loyalty_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  current_program_id uuid not null references public.loyalty_programs (id) on delete restrict,
  stamps integer not null default 0 check (stamps >= 0),
  lifetime_visits integer not null default 0 check (lifetime_visits >= 0),
  last_visit_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, restaurant_id)
);

alter table public.loyalty_cards enable row level security;

create trigger set_loyalty_cards_updated_at
  before update on public.loyalty_cards
  for each row execute function public.set_updated_at();

create index loyalty_cards_user_id_idx
  on public.loyalty_cards (user_id);

create index loyalty_cards_restaurant_id_idx
  on public.loyalty_cards (restaurant_id);

create index loyalty_cards_current_program_id_idx
  on public.loyalty_cards (current_program_id);

-- 8. Scan Logs (journal d'audit immuable, cf. ADR-004 & ADR-010)
create table public.scan_logs (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.loyalty_cards (id) on delete cascade,
  program_id uuid not null references public.loyalty_programs (id) on delete restrict,
  staff_id uuid not null references public.profiles (id) on delete restrict,
  type public.scan_log_type not null,
  delta integer not null,
  cooldown_overridden boolean not null default false,
  reverses_log_id uuid unique references public.scan_logs (id) on delete restrict,
  idempotency_key uuid not null unique,
  created_at timestamptz not null default now(),
  constraint scan_logs_reversal_consistency_chk check (
    (type = 'reversal' and reverses_log_id is not null)
    or (type <> 'reversal' and reverses_log_id is null)
  )
);

alter table public.scan_logs enable row level security;

create index scan_logs_card_id_created_at_idx
  on public.scan_logs (card_id, created_at desc);

create index scan_logs_program_id_idx
  on public.scan_logs (program_id);

create index scan_logs_staff_id_idx
  on public.scan_logs (staff_id);

