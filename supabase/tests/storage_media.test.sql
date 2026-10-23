-- ============================================================================
-- Étape 5.3 : tests pgTAP des policies du bucket `restaurant-media` (migration 9)
--   - écriture réservée à l'owner du dossier `<restaurant_id>/`
--   - (la suppression directe dans storage.objects est bloquée par Supabase : elle passe par l'API Storage)
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

insert into tap_log (tap) select plan(6);

-- Fixtures (superuser)
insert into public.restaurants (id, slug, name, category, is_active)
values
  ('a4a4a4a4-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'test-media-1', 'Resto Media 1', 'burger', true),
  ('a4a4a4a4-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'test-media-2', 'Resto Media 2', 'pizza', true);

insert into auth.users (id, aud, role, email, raw_user_meta_data)
values
  ('c4c4c4c4-cccc-4ccc-8ccc-ccccccccccc1', 'authenticated', 'authenticated', 'media-owner@test.local', '{"display_name":"Owner"}'::jsonb),
  ('c4c4c4c4-cccc-4ccc-8ccc-ccccccccccc2', 'authenticated', 'authenticated', 'media-staff@test.local', '{"display_name":"Staff"}'::jsonb);

insert into public.restaurant_members (restaurant_id, user_id, role)
values
  ('a4a4a4a4-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c4c4c4c4-cccc-4ccc-8ccc-ccccccccccc1', 'owner'),
  ('a4a4a4a4-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c4c4c4c4-cccc-4ccc-8ccc-ccccccccccc2', 'staff');

-- ----------------------------------------------------------------------------
-- OWNER du restaurant 1
-- ----------------------------------------------------------------------------
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c4c4c4c4-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated"}';

insert into tap_log (tap) select lives_ok(
  $$ insert into storage.objects (bucket_id, name) values ('restaurant-media', 'a4a4a4a4-aaaa-4aaa-8aaa-aaaaaaaaaaa1/logo-test.webp') $$,
  'Owner peut écrire dans le dossier de son restaurant'
);

insert into tap_log (tap) select throws_ok(
  $$ insert into storage.objects (bucket_id, name) values ('restaurant-media', 'a4a4a4a4-aaaa-4aaa-8aaa-aaaaaaaaaaa2/logo-pirate.webp') $$,
  '42501', null,
  'Owner 1 ne peut pas écrire dans le dossier du restaurant 2'
);

insert into tap_log (tap) select throws_ok(
  $$ insert into storage.objects (bucket_id, name) values ('restaurant-media', 'pas-un-uuid/logo.webp') $$,
  '42501', null,
  'Un dossier qui n''est pas un UUID de restaurant est refusé'
);

insert into tap_log (tap) select is(
  (select count(*)::int from storage.objects where name = 'a4a4a4a4-aaaa-4aaa-8aaa-aaaaaaaaaaa1/logo-test.webp'),
  1,
  'Owner relit le fichier qu''il a écrit'
);

-- ----------------------------------------------------------------------------
-- STAFF du restaurant 1
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"c4c4c4c4-cccc-4ccc-8ccc-ccccccccccc2","role":"authenticated"}';

insert into tap_log (tap) select throws_ok(
  $$ insert into storage.objects (bucket_id, name) values ('restaurant-media', 'a4a4a4a4-aaaa-4aaa-8aaa-aaaaaaaaaaa1/logo-staff.webp') $$,
  '42501', null,
  'Staff ne peut pas écrire dans le dossier de son restaurant (owner uniquement)'
);

-- ----------------------------------------------------------------------------
-- ANONYME
-- ----------------------------------------------------------------------------
set local role anon;
set local "request.jwt.claims" = '{}';

insert into tap_log (tap) select throws_ok(
  $$ insert into storage.objects (bucket_id, name) values ('restaurant-media', 'a4a4a4a4-aaaa-4aaa-8aaa-aaaaaaaaaaa1/logo-anon.webp') $$,
  '42501', null,
  'Anonyme ne peut pas écrire dans le bucket'
);

reset role;

insert into tap_log (tap) select * from finish();

select seq, tap from tap_log order by seq;

rollback;
