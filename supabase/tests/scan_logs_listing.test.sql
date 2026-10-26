-- ============================================================================
-- Phase 7 : tests pgTAP de la migration 13
--   - publication Realtime de `loyalty_cards` et `scan_logs`
--   - list_scan_logs : tous les logs du restaurant avec prénoms, ligne annulée
--     signalée, pagination par curseur, isolation entre restaurants, accès refusé
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

-- Fixtures : restaurants A et B, un palier chacun, 1 employé et 1 client (A), 1 gérant (B)
insert into public.restaurants (id, slug, name, category, is_active)
values
  ('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'test-logs-a', 'Resto Logs A', 'burger', true),
  ('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'test-logs-b', 'Resto Logs B', 'pizza', true);

insert into public.loyalty_programs (id, restaurant_id, position, threshold, reward_label)
values
  ('b7b7b7b7-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 1, 10, 'Dessert'),
  ('b7b7b7b7-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 1, 10, 'Boisson');

insert into auth.users (id, aud, role, email, raw_user_meta_data)
values
  ('c7c7c7c7-cccc-4ccc-8ccc-ccccccccc001', 'authenticated', 'authenticated', 'logs-staff@test.local', '{"display_name":"Lea"}'::jsonb),
  ('c7c7c7c7-cccc-4ccc-8ccc-ccccccccc002', 'authenticated', 'authenticated', 'logs-client@test.local', '{"display_name":"Sam"}'::jsonb),
  ('c7c7c7c7-cccc-4ccc-8ccc-ccccccccc003', 'authenticated', 'authenticated', 'logs-owner-b@test.local', '{"display_name":"Bob"}'::jsonb);

insert into public.restaurant_members (restaurant_id, user_id, role)
values
  ('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c7c7c7c7-cccc-4ccc-8ccc-ccccccccc001', 'staff'),
  ('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'c7c7c7c7-cccc-4ccc-8ccc-ccccccccc003', 'owner');

insert into public.loyalty_cards (id, user_id, restaurant_id, current_program_id, stamps, lifetime_visits)
values ('d7d7d7d7-dddd-4ddd-8ddd-ddddddddddd1', 'c7c7c7c7-cccc-4ccc-8ccc-ccccccccc002',
        'a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'b7b7b7b7-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 1, 3);

-- 3 passages (le 3e est annulé) + 1 annulation, du plus ancien au plus récent
insert into public.scan_logs (id, card_id, restaurant_id, program_id, staff_id, type, delta, cooldown_overridden, reverses_log_id, idempotency_key, created_at)
values
  ('e7e7e7e7-eeee-4eee-8eee-eeeeeeeeeee1', 'd7d7d7d7-dddd-4ddd-8ddd-ddddddddddd1', 'a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'b7b7b7b7-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'c7c7c7c7-cccc-4ccc-8ccc-ccccccccc001', 'visit', 1, false, null, 'f7f7f7f7-ffff-4fff-8fff-fffffffffff1', now() - interval '4 hours'),
  ('e7e7e7e7-eeee-4eee-8eee-eeeeeeeeeee2', 'd7d7d7d7-dddd-4ddd-8ddd-ddddddddddd1', 'a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'b7b7b7b7-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'c7c7c7c7-cccc-4ccc-8ccc-ccccccccc001', 'visit', 1, false, null, 'f7f7f7f7-ffff-4fff-8fff-fffffffffff2', now() - interval '3 hours'),
  ('e7e7e7e7-eeee-4eee-8eee-eeeeeeeeeee3', 'd7d7d7d7-dddd-4ddd-8ddd-ddddddddddd1', 'a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'b7b7b7b7-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'c7c7c7c7-cccc-4ccc-8ccc-ccccccccc001', 'visit', 1, true, null, 'f7f7f7f7-ffff-4fff-8fff-fffffffffff3', now() - interval '2 hours'),
  ('e7e7e7e7-eeee-4eee-8eee-eeeeeeeeeee4', 'd7d7d7d7-dddd-4ddd-8ddd-ddddddddddd1', 'a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'b7b7b7b7-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'c7c7c7c7-cccc-4ccc-8ccc-ccccccccc001', 'reversal', -1, false, 'e7e7e7e7-eeee-4eee-8eee-eeeeeeeeeee3', 'f7f7f7f7-ffff-4fff-8fff-fffffffffff4', now() - interval '1 hour');

-- 1-2. Publication Realtime
insert into tap_log (tap) select is(
  (select count(*)::int from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'loyalty_cards'),
  1, 'Realtime : loyalty_cards est publiée'
);

insert into tap_log (tap) select is(
  (select count(*)::int from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'scan_logs'),
  1, 'Realtime : scan_logs est publiée'
);

-- ----------------------------------------------------------------------------
-- EMPLOYÉ de A
-- ----------------------------------------------------------------------------
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c7c7c7c7-cccc-4ccc-8ccc-ccccccccc001","role":"authenticated"}';

insert into tap_log (tap) select is(
  (select count(*)::int from public.list_scan_logs('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1')),
  4, 'list_scan_logs : tous les logs du restaurant, pas seulement ceux de l''employé'
);

insert into tap_log (tap) select is(
  (select customer_name || '/' || staff_name from public.list_scan_logs('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1') limit 1),
  'Sam/Lea', 'list_scan_logs : prénoms du client et de l''employé'
);

insert into tap_log (tap) select is(
  (select log_id from public.list_scan_logs('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1') limit 1),
  'e7e7e7e7-eeee-4eee-8eee-eeeeeeeeeee4'::uuid, 'list_scan_logs : du plus récent au plus ancien'
);

insert into tap_log (tap) select is(
  (select is_reversed::text || '/' || (reversed_at is not null)::text from public.list_scan_logs('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1') where log_id = 'e7e7e7e7-eeee-4eee-8eee-eeeeeeeeeee3'),
  'true/true', 'list_scan_logs : un passage annulé est signalé avec l''heure de l''annulation'
);

insert into tap_log (tap) select is(
  (select is_reversed from public.list_scan_logs('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1') where log_id = 'e7e7e7e7-eeee-4eee-8eee-eeeeeeeeeee2'),
  false, 'list_scan_logs : un passage non annulé n''est pas signalé'
);

-- 7. Curseur : la page suivante repart après le 2e log (log 3 = 3e plus récent est exclu du curseur)
insert into tap_log (tap) select is(
  (select string_agg(right(log_id::text, 1), ',' order by created_at desc) from public.list_scan_logs(
     'a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
     (select created_at from public.scan_logs where id = 'e7e7e7e7-eeee-4eee-8eee-eeeeeeeeeee3'),
     'e7e7e7e7-eeee-4eee-8eee-eeeeeeeeeee3')),
  '2,1', 'list_scan_logs : le curseur renvoie uniquement les logs plus anciens'
);

-- 8. Limite
insert into tap_log (tap) select is(
  (select count(*)::int from public.list_scan_logs('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1', null, null, 2)),
  2, 'list_scan_logs : la limite est respectée'
);

-- 9. Isolation : employé de A refusé sur B
insert into tap_log (tap) select throws_ok(
  $$ select * from public.list_scan_logs('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa2') $$,
  '42501', 'forbidden', 'list_scan_logs : un employé de A ne lit pas le journal de B'
);

-- ----------------------------------------------------------------------------
-- CLIENT (non membre) et ANONYME
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"c7c7c7c7-cccc-4ccc-8ccc-ccccccccc002","role":"authenticated"}';

insert into tap_log (tap) select throws_ok(
  $$ select * from public.list_scan_logs('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1') $$,
  '42501', 'forbidden', 'list_scan_logs : un client ne lit pas le journal du restaurant'
);

reset role;
set local role anon;
set local "request.jwt.claims" = '{}';

insert into tap_log (tap) select throws_ok(
  $$ select * from public.list_scan_logs('a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1') $$,
  '42501', null, 'Anonyme ne peut pas exécuter list_scan_logs'
);

reset role;

insert into tap_log (tap) select * from finish();

select seq, tap from tap_log order by seq;

rollback;
