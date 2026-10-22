-- ============================================================================
-- Audit Phase 3 : tests pgTAP du durcissement du schéma (migration 7)
--   - format du qr_token (ADR-013)
--   - colonnes de profiles modifiables (signup_restaurant_id protégé)
--   - scan_logs : cohérence restaurant/carte, immutabilité, anonymisation RGPD (ADR-012)
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

insert into tap_log (tap) select plan(12);

-- Fixtures (superuser)
insert into public.restaurants (id, slug, name, category, is_active)
values
  ('a2a2a2a2-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'test-hardening-1', 'Resto Durcissement 1', 'burger', true),
  ('a2a2a2a2-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'test-hardening-2', 'Resto Durcissement 2', 'pizza', true);

insert into public.loyalty_programs (id, restaurant_id, position, threshold, reward_label)
values ('b2b2b2b2-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'a2a2a2a2-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 1, 10, 'Burger offert');

insert into auth.users (id, aud, role, email, raw_user_meta_data)
values
  ('c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc1', 'authenticated', 'authenticated', 'hard-client@test.local', '{"display_name":"Client"}'::jsonb),
  ('c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc2', 'authenticated', 'authenticated', 'hard-owner@test.local', '{"display_name":"Owner"}'::jsonb),
  ('c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc3', 'authenticated', 'authenticated', 'hard-other@test.local', '{"display_name":"Other"}'::jsonb);

insert into public.restaurant_members (restaurant_id, user_id, role)
values ('a2a2a2a2-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc2', 'owner');

insert into public.loyalty_cards (id, user_id, restaurant_id, current_program_id, stamps, lifetime_visits)
values ('d2d2d2d2-dddd-4ddd-8ddd-ddddddddddd1', 'c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc1',
        'a2a2a2a2-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'b2b2b2b2-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 1, 1);

insert into public.scan_logs (id, restaurant_id, card_id, program_id, staff_id, type, delta, idempotency_key)
values ('e2e2e2e2-eeee-4eee-8eee-eeeeeeeeeee1', 'a2a2a2a2-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
        'd2d2d2d2-dddd-4ddd-8ddd-ddddddddddd1', 'b2b2b2b2-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
        'c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc2', 'visit', 1, 'f2f2f2f2-ffff-4fff-8fff-fffffffffff1');

-- 1. qr_token : 20 caractères base32 majuscules
insert into tap_log (tap) select matches(
  (select qr_token from public.profiles where id = 'c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc1'),
  '^[A-Z2-7]{20}$',
  'qr_token généré : 20 caractères base32 majuscules'
);

insert into tap_log (tap) select throws_ok(
  $$ update public.profiles set qr_token = repeat('a', 48) where id = 'c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc1' $$,
  '23514',
  null,
  'Le format du qr_token est imposé par une contrainte CHECK'
);

-- 2. Cohérence restaurant du log / restaurant de la carte
insert into tap_log (tap) select throws_ok(
  $$ insert into public.scan_logs (restaurant_id, card_id, program_id, staff_id, type, delta, idempotency_key)
     values ('a2a2a2a2-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'd2d2d2d2-dddd-4ddd-8ddd-ddddddddddd1',
             'b2b2b2b2-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc2',
             'visit', 1, 'f2f2f2f2-ffff-4fff-8fff-fffffffffff2') $$,
  '23503',
  null,
  'Un log ne peut pas référencer un restaurant différent de celui de sa carte'
);

-- 3. Colonnes de profiles : un client ne peut écrire que display_name
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated"}';

insert into tap_log (tap) select throws_ok(
  $$ update public.profiles set signup_restaurant_id = 'a2a2a2a2-aaaa-4aaa-8aaa-aaaaaaaaaaa2'
     where id = 'c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc1' $$,
  '42501',
  'permission denied for table profiles',
  'Un client ne peut pas modifier son signup_restaurant_id'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.scan_logs where id = 'e2e2e2e2-eeee-4eee-8eee-eeeeeeeeeee1'),
  1,
  'Avant suppression, le client lit le log de sa carte'
);

-- 4. Immutabilité : toute modification hors anonymisation est refusée
reset role;

insert into tap_log (tap) select throws_ok(
  $$ update public.scan_logs set delta = 5 where id = 'e2e2e2e2-eeee-4eee-8eee-eeeeeeeeeee1' $$,
  'P0001',
  'scan_logs is immutable: updates are forbidden',
  'scan_logs reste immuable (delta non modifiable)'
);

insert into tap_log (tap) select throws_ok(
  $$ update public.scan_logs set restaurant_id = 'a2a2a2a2-aaaa-4aaa-8aaa-aaaaaaaaaaa2'
     where id = 'e2e2e2e2-eeee-4eee-8eee-eeeeeeeeeee1' $$,
  'P0001',
  'scan_logs is immutable: updates are forbidden',
  'scan_logs reste immuable (restaurant_id non modifiable)'
);

-- 5. RGPD : suppression du compte client => profil + carte supprimés, log conservé anonymisé
delete from auth.users where id = 'c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc1';

insert into tap_log (tap) select is(
  (select count(*)::int from public.profiles where id = 'c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc1')
  + (select count(*)::int from public.loyalty_cards where id = 'd2d2d2d2-dddd-4ddd-8ddd-ddddddddddd1'),
  0,
  'Suppression du compte : profil et carte du client supprimés'
);

insert into tap_log (tap) select ok(
  exists (
    select 1 from public.scan_logs
    where id = 'e2e2e2e2-eeee-4eee-8eee-eeeeeeeeeee1'
      and card_id is null
      and type = 'visit'
      and delta = 1
      and restaurant_id = 'a2a2a2a2-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
  ),
  'Le log est conservé mais anonymisé (card_id = NULL, reste intact)'
);

-- 6. Le restaurateur voit toujours le log anonymisé ; un tiers non
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc2","role":"authenticated"}';

insert into tap_log (tap) select is(
  (select count(*)::int from public.scan_logs where id = 'e2e2e2e2-eeee-4eee-8eee-eeeeeeeeeee1'),
  1,
  'Le restaurateur lit toujours le log anonymisé de son restaurant'
);

set local "request.jwt.claims" = '{"sub":"c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc3","role":"authenticated"}';

insert into tap_log (tap) select is(
  (select count(*)::int from public.scan_logs where id = 'e2e2e2e2-eeee-4eee-8eee-eeeeeeeeeee1'),
  0,
  'Un autre utilisateur ne lit pas le log anonymisé'
);

-- 7. Suppression du compte de l'employé : plus de blocage, log anonymisé
reset role;

delete from auth.users where id = 'c2c2c2c2-cccc-4ccc-8ccc-ccccccccccc2';

insert into tap_log (tap) select ok(
  exists (
    select 1 from public.scan_logs
    where id = 'e2e2e2e2-eeee-4eee-8eee-eeeeeeeeeee1' and staff_id is null and card_id is null
  ),
  'Suppression du compte employé : log conservé avec staff_id = NULL'
);

insert into tap_log (tap) select * from finish();

select seq, tap from tap_log order by seq;

rollback;
