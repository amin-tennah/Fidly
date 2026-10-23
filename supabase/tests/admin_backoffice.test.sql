-- ============================================================================
-- Étape 5.5 : tests pgTAP des droits utilisés par le back-office /admin
--   - un admin crée un restaurant et une invitation, lit membres et profils, supprime
--   - le slug est unique (le code 23505 déclenche le candidat suivant)
--   - ni un owner ni un client ne peuvent créer un restaurant ou une invitation
-- Aucune migration : ce sont les policies existantes (2.5). Exécutable via `pnpm db:test`.
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

insert into tap_log (tap) select plan(9);

-- Fixtures (superuser)
insert into public.restaurants (id, slug, name, category, is_active)
values ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'test-admin-existing', 'Resto Admin Existant', 'burger', true);

insert into auth.users (id, aud, role, email, raw_user_meta_data)
values
  ('c6c6c6c6-cccc-4ccc-8ccc-ccccccccccc1', 'authenticated', 'authenticated', 'adm-admin@test.local', '{"display_name":"Admin"}'::jsonb),
  ('c6c6c6c6-cccc-4ccc-8ccc-ccccccccccc2', 'authenticated', 'authenticated', 'adm-owner@test.local', '{"display_name":"Owner"}'::jsonb),
  ('c6c6c6c6-cccc-4ccc-8ccc-ccccccccccc3', 'authenticated', 'authenticated', 'adm-client@test.local', '{"display_name":"Client"}'::jsonb);

insert into public.platform_admins (user_id)
values ('c6c6c6c6-cccc-4ccc-8ccc-ccccccccccc1');

insert into public.restaurant_members (restaurant_id, user_id, role)
values ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c6c6c6c6-cccc-4ccc-8ccc-ccccccccccc2', 'owner');

-- ----------------------------------------------------------------------------
-- ADMIN
-- ----------------------------------------------------------------------------
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c6c6c6c6-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated"}';

insert into tap_log (tap) select lives_ok(
  $$ insert into public.restaurants (id, slug, name, category)
     values ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'test-admin-created', 'Resto Admin Créé', 'pizza') $$,
  'Admin peut créer un restaurant'
);

insert into tap_log (tap) select lives_ok(
  $$ insert into public.restaurant_invitations (restaurant_id, email, role, invited_by, expires_at)
     values ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'gerant@test.local', 'owner',
             'c6c6c6c6-cccc-4ccc-8ccc-ccccccccccc1', now() + interval '14 days') $$,
  'Admin peut inviter un gérant'
);

insert into tap_log (tap) select throws_ok(
  $$ insert into public.restaurants (slug, name, category) values ('test-admin-created', 'Doublon', 'other') $$,
  '23505', null,
  'Le slug est unique : un doublon lève 23505 (candidat suivant côté application)'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.profiles where id = 'c6c6c6c6-cccc-4ccc-8ccc-ccccccccccc2'),
  1,
  'Admin lit le profil d''un gérant (prénom affiché dans la liste)'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.restaurant_members where restaurant_id = 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
  1,
  'Admin lit les membres d''un restaurant'
);

delete from public.restaurants where id = 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2';

insert into tap_log (tap) select is(
  (select count(*)::int from public.restaurants where id = 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2'),
  0,
  'Admin peut supprimer le restaurant qu''il vient de créer (annulation si l''invitation échoue)'
);

-- ----------------------------------------------------------------------------
-- OWNER d'un restaurant
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"c6c6c6c6-cccc-4ccc-8ccc-ccccccccccc2","role":"authenticated"}';

insert into tap_log (tap) select throws_ok(
  $$ insert into public.restaurants (slug, name, category) values ('test-owner-pirate', 'Pirate', 'other') $$,
  '42501', null,
  'Un owner ne peut pas créer de restaurant'
);

insert into tap_log (tap) select throws_ok(
  $$ insert into public.restaurant_invitations (restaurant_id, email, role, expires_at)
     values ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'pirate@test.local', 'owner', now() + interval '14 days') $$,
  '42501', null,
  'Un owner ne peut pas émettre d''invitation (admin uniquement)'
);

-- ----------------------------------------------------------------------------
-- CLIENT
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"c6c6c6c6-cccc-4ccc-8ccc-ccccccccccc3","role":"authenticated"}';

insert into tap_log (tap) select throws_ok(
  $$ insert into public.restaurants (slug, name, category) values ('test-client-pirate', 'Pirate', 'other') $$,
  '42501', null,
  'Un client ne peut pas créer de restaurant'
);

reset role;

insert into tap_log (tap) select * from finish();

select seq, tap from tap_log order by seq;

rollback;
