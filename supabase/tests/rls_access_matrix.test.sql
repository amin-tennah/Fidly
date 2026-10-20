-- ============================================================================
-- Étape 2.8 : Tests SQL pgTAP de la matrice d'accès RLS et des contraintes
-- Exécutable via `pnpm db:test` (supabase db query --linked -f ...)
-- ============================================================================

begin;

create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

create temp table tap_log (
  seq serial primary key,
  tap text not null
);
grant insert, select on table tap_log to anon, authenticated;
grant usage, select on sequence tap_log_seq_seq to anon, authenticated;

insert into tap_log (tap) select plan(20);

-- ----------------------------------------------------------------------------
-- Préparation des fixtures de test (en tant que superuser / postgres)
-- ----------------------------------------------------------------------------
insert into public.restaurants (id, slug, name, category, is_active)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'test-resto-1', 'Test Resto 1', 'burger', true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'test-resto-2', 'Test Resto 2', 'pizza', true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'test-resto-inactif', 'Test Resto Inactif', 'other', false);

insert into public.loyalty_programs (id, restaurant_id, position, threshold, reward_label)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 1, 10, 'Burger offert'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 1, 10, 'Pizza offerte');

insert into auth.users (id, aud, role, email, raw_user_meta_data)
values
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'authenticated', 'authenticated', 'client-a@test.local', '{"display_name":"Client A"}'::jsonb),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'authenticated', 'authenticated', 'client-b@test.local', '{"display_name":"Client B"}'::jsonb),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'authenticated', 'authenticated', 'owner-1@test.local', '{"display_name":"Owner 1"}'::jsonb),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc4', 'authenticated', 'authenticated', 'owner-2@test.local', '{"display_name":"Owner 2"}'::jsonb);

insert into public.restaurant_members (restaurant_id, user_id, role)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'owner'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc4', 'owner');

insert into public.loyalty_cards (id, user_id, restaurant_id, current_program_id, stamps, lifetime_visits)
values
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 4, 4),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd2', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 2, 2);

insert into public.scan_logs (id, card_id, program_id, staff_id, type, delta, idempotency_key)
values
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', 'dddddddd-dddd-4ddd-8ddd-ddddddddddd1', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'visit', 1, 'ffffffff-ffff-4fff-8fff-fffffffffff1');

-- ----------------------------------------------------------------------------
-- 1. Vérification du trigger d'inscription (Étape 2.4)
-- ----------------------------------------------------------------------------
insert into tap_log (tap) select is(
  (select display_name from public.profiles where id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1'),
  'Client A',
  'Trigger handle_new_user crée le profil avec display_name'
);

insert into tap_log (tap) select matches(
  (select short_code from public.profiles where id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1'),
  '^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$',
  'Trigger handle_new_user génère un short_code 6 caractères sans 0/O/1/I/L'
);

-- ----------------------------------------------------------------------------
-- 2. Cas ANONYME (anon)
-- ----------------------------------------------------------------------------
set local role anon;
set local "request.jwt.claims" = '{}';

insert into tap_log (tap) select is(
  (select count(*)::int from public.profiles where id in ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2')),
  0,
  'Anonyme ne peut lire aucun profil'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.restaurants where id in ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3')),
  1,
  'Anonyme lit uniquement les restaurants actifs (is_active = true)'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.loyalty_programs where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
  1,
  'Anonyme peut lire les programmes de fidélité'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.loyalty_cards where id = 'dddddddd-dddd-4ddd-8ddd-ddddddddddd1'),
  0,
  'Anonyme ne peut lire aucune carte de fidélité'
);

-- ----------------------------------------------------------------------------
-- 3. Cas CLIENT A (authenticated : cccccccc-cccc-4ccc-8ccc-ccccccccccc1)
-- ----------------------------------------------------------------------------
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"cccccccc-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated"}';

insert into tap_log (tap) select is(
  (select count(*)::int from public.profiles where id in ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2')),
  1,
  'Client A lit uniquement son propre profil (pas celui de Client B)'
);

update public.profiles
set display_name = 'Client A Modifié'
where id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1';

insert into tap_log (tap) select is(
  (select display_name from public.profiles where id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1'),
  'Client A Modifié',
  'Client A peut modifier son propre display_name'
);

insert into tap_log (tap) select throws_ok(
  $$update public.profiles set qr_token = repeat('a', 48) where id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1'$$,
  'P0001',
  'Modifying qr_token directly is forbidden',
  'Client A ne peut pas modifier son qr_token directement'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.loyalty_cards where id in ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', 'dddddddd-dddd-4ddd-8ddd-ddddddddddd2')),
  1,
  'Client A lit uniquement ses propres loyalty_cards'
);

insert into tap_log (tap) select throws_ok(
  $$update public.loyalty_cards set stamps = 99 where id = 'dddddddd-dddd-4ddd-8ddd-ddddddddddd1'$$,
  '42501',
  'permission denied for table loyalty_cards',
  'Client A ne peut JAMAIS modifier ses stamps sur loyalty_cards (permission denied)'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.scan_logs where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1'),
  1,
  'Client A peut lire les scan_logs de sa propre carte'
);

insert into tap_log (tap) select throws_ok(
  $$ insert into public.restaurant_members (restaurant_id, user_id, role) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'owner') $$,
  '42501',
  'permission denied for table restaurant_members',
  'Un utilisateur ne peut pas s''insérer lui-même dans restaurant_members'
);

insert into tap_log (tap) select throws_ok(
  $$ insert into public.platform_admins (user_id) values ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1') $$,
  '42501',
  'permission denied for table platform_admins',
  'Un utilisateur ne peut pas s''insérer lui-même dans platform_admins'
);

-- ----------------------------------------------------------------------------
-- 4. Cas OWNER DU RESTAURANT 1 (authenticated : cccccccc-cccc-4ccc-8ccc-ccccccccccc3)
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"cccccccc-cccc-4ccc-8ccc-ccccccccccc3","role":"authenticated"}';

update public.restaurants
set name = 'Test Resto 1 Renommé'
where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1';

insert into tap_log (tap) select is(
  (select name from public.restaurants where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
  'Test Resto 1 Renommé',
  'Owner 1 peut modifier son propre restaurant'
);

update public.restaurants
set name = 'Piratage Resto 2'
where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2';

insert into tap_log (tap) select is(
  (select name from public.restaurants where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2'),
  'Test Resto 2',
  'Owner 1 ne peut PAS modifier le restaurant d''un autre restaurateur'
);

update public.loyalty_programs
set reward_label = 'Burger + Boisson offerts'
where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1';

insert into tap_log (tap) select is(
  (select reward_label from public.loyalty_programs where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
  'Burger + Boisson offerts',
  'Owner 1 peut modifier les loyalty_programs de son restaurant'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.loyalty_cards where id in ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', 'dddddddd-dddd-4ddd-8ddd-ddddddddddd2')),
  1,
  'Owner 1 lit les loyalty_cards de son restaurant mais pas celles d''un autre restaurant'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.scan_logs where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1'),
  1,
  'Owner 1 lit les scan_logs de son restaurant'
);

insert into tap_log (tap) select throws_ok(
  $$ delete from public.scan_logs where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1' $$,
  '42501',
  'permission denied for table scan_logs',
  'scan_logs est immuable : même l''owner ne peut pas supprimer un log'
);

insert into tap_log (tap) select * from finish();

select seq, tap from tap_log order by seq;

rollback;
