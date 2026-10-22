-- ============================================================================
-- Fidly — Données de développement (Étape 2.7 : seed.sql)
-- 2 restaurants, 3 programmes (2 paliers + 1 palier), 1 owner, 3 clients,
-- cartes illustrant ADR-009 (7/10, 13/10, 13/20) et logs illustrant ADR-010.
-- ============================================================================

begin;

-- UUIDs déterministes de développement
-- Restaurants
--   r1 (Burger Artisan Paris) : 11111111-1111-4111-8111-111111111101
--   r2 (Kawa Coffee Roasters) : 11111111-1111-4111-8111-111111111102
-- Programmes
--   p1 (Burger Palier 1 - 10) : 22222222-2222-4222-8222-222222222201
--   p2 (Burger Palier 2 - 20) : 22222222-2222-4222-8222-222222222202
--   p3 (Kawa Palier 1 - 8)    : 22222222-2222-4222-8222-222222222203
-- Utilisateurs (auth.users -> trigger on_auth_user_created -> public.profiles)
--   u_owner (Marc - Owner r1) : 33333333-3333-4333-8333-333333333301
--   u_alice (Alice - Client)  : 33333333-3333-4333-8333-333333333302
--   u_bilal (Bilal - Client)  : 33333333-3333-4333-8333-333333333303
--   u_chloe (Chloé - Client)  : 33333333-3333-4333-8333-333333333304

-- 1. Restaurants
insert into public.restaurants (
  id,
  slug,
  name,
  category,
  address,
  location,
  opening_hours,
  subscription_status,
  is_active
)
values
  (
    '11111111-1111-4111-8111-111111111101',
    'burger-artisan-paris',
    'Burger Artisan Paris',
    'burger',
    '14 Rue de Rivoli, 75004 Paris',
    extensions.st_setsrid(extensions.st_makepoint(2.3568, 48.8566), 4326)::extensions.geography,
    '{"mon":"11:30-22:30","tue":"11:30-22:30","wed":"11:30-22:30","thu":"11:30-23:00","fri":"11:30-23:30","sat":"11:30-23:30","sun":"12:00-22:00"}'::jsonb,
    'active',
    true
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'kawa-coffee-roasters',
    'Kawa Coffee Roasters',
    'coffee_shop',
    '42 Rue des Archives, 75003 Paris',
    extensions.st_setsrid(extensions.st_makepoint(2.3601, 48.8619), 4326)::extensions.geography,
    '{"mon":"08:00-18:00","tue":"08:00-18:00","wed":"08:00-18:00","thu":"08:00-18:00","fri":"08:00-18:30","sat":"09:00-19:00","sun":"09:30-17:30"}'::jsonb,
    'trialing',
    true
  )
on conflict (id) do nothing;

-- 2. Programmes de fidélité (3 programmes : 2 paliers chez Burger Artisan, 1 palier chez Kawa)
insert into public.loyalty_programs (
  id,
  restaurant_id,
  position,
  threshold,
  reward_label,
  is_active
)
values
  (
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111101',
    1,
    10,
    'Menu Burger Classique offert',
    true
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111101',
    2,
    20,
    'Menu Double Smash + Dessert maison offert',
    true
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    '11111111-1111-4111-8111-111111111102',
    1,
    8,
    'Boisson chaude de spécialité au choix offerte',
    true
  )
on conflict (id) do nothing;

-- 3. Comptes utilisateurs dans auth.users (déclenche handle_new_user -> public.profiles)
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '33333333-3333-4333-8333-333333333301',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'owner@fidly-dev.local',
    extensions.crypt('FidlyDev2026!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Marc (Gérant)"}'::jsonb,
    now(),
    now()
  ),
  (
    '33333333-3333-4333-8333-333333333302',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'alice@fidly-dev.local',
    extensions.crypt('FidlyDev2026!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Alice"}'::jsonb,
    now(),
    now()
  ),
  (
    '33333333-3333-4333-8333-333333333303',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'bilal@fidly-dev.local',
    extensions.crypt('FidlyDev2026!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Bilal"}'::jsonb,
    now(),
    now()
  ),
  (
    '33333333-3333-4333-8333-333333333304',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'chloe@fidly-dev.local',
    extensions.crypt('FidlyDev2026!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Chloé"}'::jsonb,
    now(),
    now()
  )
on conflict (id) do nothing;

-- 4. Rattachement du gérant au restaurant 1
insert into public.restaurant_members (
  restaurant_id,
  user_id,
  role
)
values (
  '11111111-1111-4111-8111-111111111101',
  '33333333-3333-4333-8333-333333333301',
  'owner'
)
on conflict (restaurant_id, user_id) do nothing;

-- 5. Cartes de fidélité (ADR-009 : 7/10, 13/10 avec surplus, 13/20 sur palier 2, et 4/8)
insert into public.loyalty_cards (
  id,
  user_id,
  restaurant_id,
  current_program_id,
  stamps,
  lifetime_visits,
  last_visit_at
)
values
  (
    '44444444-4444-4444-8444-444444444401',
    '33333333-3333-4333-8333-333333333302',
    '11111111-1111-4111-8111-111111111101',
    '22222222-2222-4222-8222-222222222201',
    7,
    7,
    now() - interval '1 day'
  ),
  (
    '44444444-4444-4444-8444-444444444402',
    '33333333-3333-4333-8333-333333333303',
    '11111111-1111-4111-8111-111111111101',
    '22222222-2222-4222-8222-222222222201',
    13,
    13,
    now() - interval '3 hours'
  ),
  (
    '44444444-4444-4444-8444-444444444403',
    '33333333-3333-4333-8333-333333333304',
    '11111111-1111-4111-8111-111111111101',
    '22222222-2222-4222-8222-222222222202',
    13,
    13,
    now() - interval '30 minutes'
  ),
  (
    '44444444-4444-4444-8444-444444444404',
    '33333333-3333-4333-8333-333333333304',
    '11111111-1111-4111-8111-111111111102',
    '22222222-2222-4222-8222-222222222203',
    4,
    4,
    now() - interval '2 days'
  )
on conflict (id) do nothing;

-- 6. Journaux de scans (ADR-010 : visit, reward_redeemed, et un scan annulé par reversal)
insert into public.scan_logs (
  id,
  restaurant_id,
  card_id,
  program_id,
  staff_id,
  type,
  delta,
  cooldown_overridden,
  reverses_log_id,
  idempotency_key,
  created_at
)
values
  (
    '55555555-5555-4555-8555-555555555501',
    '11111111-1111-4111-8111-111111111101',
    '44444444-4444-4444-8444-444444444401',
    '22222222-2222-4222-8222-222222222201',
    '33333333-3333-4333-8333-333333333301',
    'visit',
    1,
    false,
    null,
    '66666666-6666-4666-8666-666666666601',
    now() - interval '1 day'
  ),
  (
    '55555555-5555-4555-8555-555555555502',
    '11111111-1111-4111-8111-111111111101',
    '44444444-4444-4444-8444-444444444403',
    '22222222-2222-4222-8222-222222222201',
    '33333333-3333-4333-8333-333333333301',
    'reward_redeemed',
    0,
    false,
    null,
    '66666666-6666-4666-8666-666666666602',
    now() - interval '2 hours'
  ),
  (
    '55555555-5555-4555-8555-555555555503',
    '11111111-1111-4111-8111-111111111101',
    '44444444-4444-4444-8444-444444444402',
    '22222222-2222-4222-8222-222222222201',
    '33333333-3333-4333-8333-333333333301',
    'visit',
    1,
    true,
    null,
    '66666666-6666-4666-8666-666666666603',
    now() - interval '15 minutes'
  ),
  (
    '55555555-5555-4555-8555-555555555504',
    '11111111-1111-4111-8111-111111111101',
    '44444444-4444-4444-8444-444444444402',
    '22222222-2222-4222-8222-222222222201',
    '33333333-3333-4333-8333-333333333301',
    'reversal',
    -1,
    false,
    '55555555-5555-4555-8555-555555555503',
    '66666666-6666-4666-8666-666666666604',
    now() - interval '12 minutes'
  )
on conflict (id) do nothing;

commit;
