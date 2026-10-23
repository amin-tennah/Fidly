-- ============================================================================
-- Étape 5.2 : tests pgTAP de l'édition de la fiche restaurant (migration 8)
--   - droits UPDATE par colonne sur `restaurants`
--   - RPC `set_restaurant_address` (autorisé ET refusé)
-- Exécutable via `pnpm db:test`.
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

insert into tap_log (tap) select plan(11);

-- Fixtures (superuser)
insert into public.restaurants (id, slug, name, category, is_active)
values
  ('a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'test-profile-1', 'Resto Fiche 1', 'burger', true),
  ('a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'test-profile-2', 'Resto Fiche 2', 'pizza', true);

insert into auth.users (id, aud, role, email, raw_user_meta_data)
values
  ('c3c3c3c3-cccc-4ccc-8ccc-ccccccccccc1', 'authenticated', 'authenticated', 'prof-owner@test.local', '{"display_name":"Owner"}'::jsonb),
  ('c3c3c3c3-cccc-4ccc-8ccc-ccccccccccc2', 'authenticated', 'authenticated', 'prof-staff@test.local', '{"display_name":"Staff"}'::jsonb),
  ('c3c3c3c3-cccc-4ccc-8ccc-ccccccccccc3', 'authenticated', 'authenticated', 'prof-other@test.local', '{"display_name":"Other"}'::jsonb);

insert into public.restaurant_members (restaurant_id, user_id, role)
values
  ('a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c3c3c3c3-cccc-4ccc-8ccc-ccccccccccc1', 'owner'),
  ('a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c3c3c3c3-cccc-4ccc-8ccc-ccccccccccc2', 'staff'),
  ('a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'c3c3c3c3-cccc-4ccc-8ccc-ccccccccccc3', 'owner');

-- ----------------------------------------------------------------------------
-- OWNER du restaurant 1
-- ----------------------------------------------------------------------------
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c3c3c3c3-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated"}';

-- 1-3. Colonnes protégées
insert into tap_log (tap) select throws_ok(
  $$ update public.restaurants set subscription_status = 'active' where id = 'a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1' $$,
  '42501', null,
  'Owner ne peut pas modifier subscription_status'
);

insert into tap_log (tap) select throws_ok(
  $$ update public.restaurants set slug = 'pirate' where id = 'a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1' $$,
  '42501', null,
  'Owner ne peut pas modifier le slug'
);

insert into tap_log (tap) select throws_ok(
  $$ update public.restaurants set is_active = false where id = 'a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1' $$,
  '42501', null,
  'Owner ne peut pas désactiver son restaurant'
);

-- 4. Colonne autorisée + contrainte de forme
update public.restaurants
set opening_hours = '{"mon":[{"open":"11:30","close":"14:30"}]}'::jsonb
where id = 'a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1';

insert into tap_log (tap) select is(
  (select opening_hours -> 'mon' -> 0 ->> 'open' from public.restaurants where id = 'a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
  '11:30',
  'Owner peut modifier opening_hours'
);

insert into tap_log (tap) select throws_ok(
  $$ update public.restaurants set opening_hours = '[]'::jsonb where id = 'a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1' $$,
  '23514', null,
  'opening_hours doit être un objet JSON'
);

-- 6-7. RPC set_restaurant_address : autorisé puis coordonnées invalides
select public.set_restaurant_address(
  'a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '12 Rue de Rivoli 75004 Paris', 2.35995, 48.855602
);

insert into tap_log (tap) select is(
  (select round(extensions.st_y(location::extensions.geometry)::numeric, 4)
   from public.restaurants where id = 'a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
  48.8556,
  'set_restaurant_address : latitude stockée (ordre lng, lat respecté)'
);

insert into tap_log (tap) select throws_ok(
  $$ select public.set_restaurant_address('a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'x', 200, 48) $$,
  '22023', null,
  'set_restaurant_address refuse une longitude hors plage'
);

-- 8. Autre restaurant
insert into tap_log (tap) select throws_ok(
  $$ select public.set_restaurant_address('a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'x', 2.3, 48.8) $$,
  '42501', null,
  'Owner 1 ne peut pas changer l''adresse du restaurant 2'
);

-- ----------------------------------------------------------------------------
-- STAFF du restaurant 1
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"c3c3c3c3-cccc-4ccc-8ccc-ccccccccccc2","role":"authenticated"}';

insert into tap_log (tap) select throws_ok(
  $$ select public.set_restaurant_address('a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'x', 2.3, 48.8) $$,
  '42501', null,
  'Staff ne peut pas changer l''adresse'
);

update public.restaurants set name = 'Piratage staff'
where id = 'a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1';

insert into tap_log (tap) select is(
  (select name from public.restaurants where id = 'a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
  'Resto Fiche 1',
  'Staff ne peut pas renommer le restaurant (RLS)'
);

-- ----------------------------------------------------------------------------
-- ANONYME
-- ----------------------------------------------------------------------------
set local role anon;
set local "request.jwt.claims" = '{}';

insert into tap_log (tap) select throws_ok(
  $$ select public.set_restaurant_address('a3a3a3a3-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'x', 2.3, 48.8) $$,
  '42501', null,
  'Anonyme ne peut pas exécuter set_restaurant_address'
);

reset role;

insert into tap_log (tap) select * from finish();

select seq, tap from tap_log order by seq;

rollback;
