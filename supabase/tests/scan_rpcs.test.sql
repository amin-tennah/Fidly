-- ============================================================================
-- Phase 6 : tests pgTAP des RPC de scan (migration 12)
--   lookup_customer, record_visit, redeem_reward, reverse_scan
--   - cooldown, idempotence, création de carte au 1er passage
--   - consommation intermédiaire (13/10 -> 13/20) et fin de cycle (22/20 -> 2/10)
--   - annulation : droits owner / staff, fenêtre de 10 min, double annulation
--   - isolation entre restaurants, limitation de débit, anonyme refusé
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

-- Jetons des clients (lus par le superuser : le personnel ne lit pas `profiles`)
create temp table fx (name text primary key, user_id uuid, qr_token text, short_code text);
grant select on table fx to authenticated;

-- Identifiants d'opérations conservés entre les étapes
create temp table keep (k text primary key, log_id uuid, card_id uuid);
grant insert, select on table keep to authenticated;

insert into tap_log (tap) select plan(31);

-- Fixtures : restaurant A (2 paliers 10 / 20) et B (1 palier 10)
insert into public.restaurants (id, slug, name, category, is_active)
values
  ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'test-scan-a', 'Resto Scan A', 'burger', true),
  ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'test-scan-b', 'Resto Scan B', 'pizza', true);

insert into public.loyalty_programs (id, restaurant_id, position, threshold, reward_label)
values
  ('b6b6b6b6-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 1, 10, 'P1'),
  ('b6b6b6b6-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 2, 20, 'P2'),
  ('b6b6b6b6-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 1, 10, 'Q1');

-- Équipe : owner (A et B), staff1 / staff2 / staff3 (A), clients c1 à c7
insert into auth.users (id, aud, role, email, raw_user_meta_data)
select ('c6c6c6c6-cccc-4ccc-8ccc-ccccccccc' || lpad(n::text, 3, '0'))::uuid,
       'authenticated', 'authenticated', 'scan-' || n || '@test.local',
       jsonb_build_object('display_name', 'U' || n)
from generate_series(1, 11) n;

-- 1 = owner, 2-4 = staff1..3, 5-11 = clients c1..c7
insert into public.restaurant_members (restaurant_id, user_id, role)
values
  ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c6c6c6c6-cccc-4ccc-8ccc-ccccccccc001', 'owner'),
  ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'c6c6c6c6-cccc-4ccc-8ccc-ccccccccc001', 'owner'),
  ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c6c6c6c6-cccc-4ccc-8ccc-ccccccccc002', 'staff'),
  ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c6c6c6c6-cccc-4ccc-8ccc-ccccccccc003', 'staff'),
  ('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c6c6c6c6-cccc-4ccc-8ccc-ccccccccc004', 'staff');

insert into fx (name, user_id, qr_token, short_code)
select 'c' || (n - 4), p.id, p.qr_token, p.short_code
from generate_series(5, 11) n
join public.profiles p
  on p.id = ('c6c6c6c6-cccc-4ccc-8ccc-ccccccccc' || lpad(n::text, 3, '0'))::uuid;

-- c2 : 13 passages sur P1 (récompense disponible) ; c3 : 22 passages sur P2 (dernier palier)
-- c4 : scan de staff1 vieux de 20 min ; c5 : scan de staff2 d'il y a 1 min
insert into public.loyalty_cards (id, user_id, restaurant_id, current_program_id, stamps, lifetime_visits, last_visit_at)
select v.id::uuid, f.user_id, 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', v.program::uuid, v.stamps, v.stamps, v.last_visit
from (values
  ('c2', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd2', 'b6b6b6b6-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 13, now() - interval '3 days'),
  ('c3', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd3', 'b6b6b6b6-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 22, now() - interval '3 days'),
  ('c4', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd4', 'b6b6b6b6-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 5, now() - interval '20 minutes'),
  ('c5', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd5', 'b6b6b6b6-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 3, now() - interval '1 minute')
) as v(name, id, program, stamps, last_visit)
join fx f on f.name = v.name;

insert into public.scan_logs (id, card_id, restaurant_id, program_id, staff_id, type, delta, idempotency_key, created_at)
values
  ('e6e6e6e6-eeee-4eee-8eee-eeeeeeeeeee4', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd4',
   'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'b6b6b6b6-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
   'c6c6c6c6-cccc-4ccc-8ccc-ccccccccc002', 'visit', 1,
   'f6f6f6f6-ffff-4fff-8fff-fffffffffff4', now() - interval '20 minutes'),
  ('e6e6e6e6-eeee-4eee-8eee-eeeeeeeeeee5', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd5',
   'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'b6b6b6b6-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
   'c6c6c6c6-cccc-4ccc-8ccc-ccccccccc003', 'visit', 1,
   'f6f6f6f6-ffff-4fff-8fff-fffffffffff5', now() - interval '1 minute');

-- ----------------------------------------------------------------------------
-- STAFF 1 (restaurant A)
-- ----------------------------------------------------------------------------
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c6c6c6c6-cccc-4ccc-8ccc-ccccccccc002","role":"authenticated"}';

-- 1-3. lookup_customer : nouveau client, code court, saisie sale
insert into tap_log (tap) select is(
  (select stamps || '/' || threshold || ' carte=' || (card_id is null)
   from public.lookup_customer((select qr_token from fx where name = 'c1'), 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1')),
  '0/10 carte=true',
  'lookup : nouveau client = 0/10 et aucune carte'
);

insert into tap_log (tap) select is(
  (select display_name from public.lookup_customer((select short_code from fx where name = 'c1'), 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1')),
  'U5',
  'lookup : le code court retrouve le client'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.lookup_customer(' ' || lower(substr((select short_code from fx where name = 'c1'), 1, 3)) || '-' || lower(substr((select short_code from fx where name = 'c1'), 4)) || ' ', 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1')),
  1,
  'lookup : minuscules, espaces et tiret tolérés'
);

-- 4. QR forgé : aucune ligne, aucune erreur
insert into tap_log (tap) select is(
  (select count(*)::int from public.lookup_customer('http://evil.example/?x=' || repeat('A', 5000), 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1')),
  0,
  'lookup : QR forgé ou très long = client introuvable'
);

-- 5-6. record_visit : carte créée au 1er passage, puis rejeu idempotent
insert into keep select 'v1', r.log_id, r.card_id
from public.record_visit('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select user_id from fx where name = 'c1'), 'f6f6f6f6-ffff-4fff-8fff-fffffffffff1') r;

insert into tap_log (tap) select is(
  (select stamps || '/' || threshold from public.record_visit('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select user_id from fx where name = 'c1'), 'f6f6f6f6-ffff-4fff-8fff-fffffffffff1')),
  '1/10',
  'record_visit : carte créée, rejeu de la même clé = toujours 1/10'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.scan_logs where idempotency_key = 'f6f6f6f6-ffff-4fff-8fff-fffffffffff1'),
  1,
  'record_visit : le rejeu n''écrit pas un second log'
);

-- 7-9. Cooldown : refusé, puis forcé et tracé
insert into tap_log (tap) select throws_ok(
  $$ select public.record_visit('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select user_id from fx where name = 'c1'), 'f6f6f6f6-ffff-4fff-8fff-fffffffffff6') $$,
  'P0001', 'cooldown_active',
  'record_visit : second passage sous 2 h refusé sans confirmation'
);

insert into tap_log (tap) select is(
  (select stamps from public.record_visit('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select user_id from fx where name = 'c1'), 'f6f6f6f6-ffff-4fff-8fff-fffffffffff7', true)),
  2,
  'record_visit : passage forcé accepté'
);

insert into tap_log (tap) select is(
  (select cooldown_overridden from public.scan_logs where idempotency_key = 'f6f6f6f6-ffff-4fff-8fff-fffffffffff7'),
  true,
  'record_visit : dépassement du cooldown tracé dans le log'
);

insert into tap_log (tap) select is(
  (select is_in_cooldown from public.lookup_customer((select qr_token from fx where name = 'c1'), 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1')),
  true,
  'lookup : cooldown signalé après un passage'
);

-- 10. Une clé déjà utilisée pour une autre carte est refusée
insert into tap_log (tap) select throws_ok(
  $$ select public.record_visit('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select user_id from fx where name = 'c6'), 'f6f6f6f6-ffff-4fff-8fff-fffffffffff1') $$,
  'P0001', 'idempotency_key_conflict',
  'record_visit : clé d''idempotence réutilisée sur un autre client refusée'
);

-- 11-12. Isolation entre restaurants : staff de A ne touche pas à B
insert into tap_log (tap) select throws_ok(
  $$ select public.record_visit('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2', (select user_id from fx where name = 'c1'), 'f6f6f6f6-ffff-4fff-8fff-fffffffffff8') $$,
  '42501', 'forbidden',
  'record_visit : staff de A ne peut pas créditer au nom de B'
);

insert into tap_log (tap) select throws_ok(
  $$ select * from public.lookup_customer((select qr_token from fx where name = 'c1'), 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2') $$,
  '42501', 'forbidden',
  'lookup : staff de A ne peut pas interroger B'
);

-- 13-15. redeem_reward : intermédiaire 13/10 -> 13/20, puis refus à 13/20
insert into tap_log (tap) select is(
  (select stamps || '/' || threshold || ' ' || reward_label from public.redeem_reward('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd2', 'f6f6f6f6-ffff-4fff-8fff-fffffffffff9')),
  '13/20 P2',
  'redeem : 13/10 -> 13/20 (stamps conservés, palier suivant)'
);

insert into tap_log (tap) select is(
  (select replayed from public.redeem_reward('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd2', 'f6f6f6f6-ffff-4fff-8fff-fffffffffff9')),
  true,
  'redeem : double-tap (même clé) = rejeu, rien n''est consommé deux fois'
);

insert into tap_log (tap) select throws_ok(
  $$ select public.redeem_reward('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd2', 'f6f6f6f6-ffff-4fff-8fff-fffffffffffa') $$,
  'P0001', 'reward_not_available',
  'redeem : 13/20, aucune récompense disponible'
);

-- 16-17. Fin de cycle : 22/20 -> 2/10 (boucle sur P1), puis annulation
insert into keep select 'r3', r.log_id, r.card_id
from public.redeem_reward('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd3', 'f6f6f6f6-ffff-4fff-8fff-fffffffffffb') r;

insert into tap_log (tap) select is(
  (select stamps || '/' || threshold || ' ' || reward_label from public.loyalty_cards c join public.loyalty_programs p on p.id = c.current_program_id where c.id = 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd3'),
  '2/10 P1',
  'redeem : fin de cycle 22/20 -> 2/10 sur le premier palier'
);

insert into tap_log (tap) select is(
  (select stamps || '/' || threshold from public.reverse_scan('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select log_id from keep where k = 'r3'), 'f6f6f6f6-ffff-4fff-8fff-fffffffffffc')),
  '22/20',
  'reverse : sa propre consommation récente annulée, 22/20 restauré'
);

-- 18-19. Double annulation et annulation d'une annulation
insert into tap_log (tap) select throws_ok(
  $$ select public.reverse_scan('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select log_id from keep where k = 'r3'), 'f6f6f6f6-ffff-4fff-8fff-fffffffffffd') $$,
  'P0001', 'already_reversed',
  'reverse : double annulation refusée'
);

insert into tap_log (tap) select throws_ok(
  $$ select public.reverse_scan('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select id from public.scan_logs where idempotency_key = 'f6f6f6f6-ffff-4fff-8fff-fffffffffffc'), 'f6f6f6f6-ffff-4fff-8fff-fffffffffffe') $$,
  'P0001', 'not_reversible',
  'reverse : une annulation n''est pas annulable'
);

-- 20. Staff : scan d'un collègue refusé
insert into tap_log (tap) select throws_ok(
  $$ select public.reverse_scan('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'e6e6e6e6-eeee-4eee-8eee-eeeeeeeeeee5', 'f6f6f6f6-ffff-4fff-8fff-ffffffffff10') $$,
  '42501', 'forbidden',
  'reverse : staff ne peut pas annuler le scan d''un collègue'
);

-- 21. Staff : son propre scan au-delà de 10 min refusé
insert into tap_log (tap) select throws_ok(
  $$ select public.reverse_scan('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'e6e6e6e6-eeee-4eee-8eee-eeeeeeeeeee4', 'f6f6f6f6-ffff-4fff-8fff-ffffffffff11') $$,
  '42501', 'forbidden',
  'reverse : staff ne peut pas annuler son scan après 10 min'
);

-- 22. Seule la dernière opération d'une carte est annulable
insert into keep select 'v2a', r.log_id, r.card_id
from public.record_visit('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select user_id from fx where name = 'c6'), 'f6f6f6f6-ffff-4fff-8fff-ffffffffff12') r;
do $$ begin perform public.record_visit('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select user_id from fx where name = 'c6'), 'f6f6f6f6-ffff-4fff-8fff-ffffffffff13', true); end $$;

insert into tap_log (tap) select throws_ok(
  $$ select public.reverse_scan('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', (select log_id from keep where k = 'v2a'), 'f6f6f6f6-ffff-4fff-8fff-ffffffffff14') $$,
  'P0001', 'not_latest_operation',
  'reverse : un scan suivi d''un autre n''est pas annulable'
);

-- ----------------------------------------------------------------------------
-- STAFF 3 : limitation de débit (10 échecs / minute)
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"c6c6c6c6-cccc-4ccc-8ccc-ccccccccc004","role":"authenticated"}';

do $$ begin
  for i in 1..10 loop
    perform * from public.lookup_customer('ZZZZZZ', 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1');
  end loop;
end $$;

insert into tap_log (tap) select throws_ok(
  $$ select * from public.lookup_customer('ZZZZZZ', 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1') $$,
  'P0001', 'rate_limited',
  'lookup : 11e échec en une minute = limité'
);

-- ----------------------------------------------------------------------------
-- OWNER (A et B)
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"c6c6c6c6-cccc-4ccc-8ccc-ccccccccc001","role":"authenticated"}';

-- 24. Owner : annule le scan vieux de 20 min d'un employé
insert into tap_log (tap) select is(
  (select stamps from public.reverse_scan('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'e6e6e6e6-eeee-4eee-8eee-eeeeeeeeeee4', 'f6f6f6f6-ffff-4fff-8fff-ffffffffff15')),
  4,
  'reverse : l''owner annule tout scan de son restaurant (5 -> 4)'
);

insert into tap_log (tap) select is(
  (select last_visit_at is null from public.loyalty_cards where id = 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd4'),
  true,
  'reverse : last_visit_at restauré (plus aucun passage actif)'
);

-- 26-27. Sur l'interface de B, le crédit va à B et seulement à B
do $$ begin perform public.record_visit('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2', (select user_id from fx where name = 'c7'), 'f6f6f6f6-ffff-4fff-8fff-ffffffffff16'); end $$;

insert into tap_log (tap) select is(
  (select count(*)::int from public.loyalty_cards where user_id = (select user_id from fx where name = 'c7') and restaurant_id = 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2'),
  1,
  'owner multi-restos : scan sur B crédite la carte de B'
);

insert into tap_log (tap) select is(
  (select count(*)::int from public.loyalty_cards where user_id = (select user_id from fx where name = 'c7') and restaurant_id = 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
  0,
  'owner multi-restos : aucune carte créée chez A'
);

-- 28. Carte d'un autre restaurant : consommation refusée
insert into tap_log (tap) select throws_ok(
  $$ select public.redeem_reward('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'd6d6d6d6-dddd-4ddd-8ddd-ddddddddddd2', 'f6f6f6f6-ffff-4fff-8fff-ffffffffff17') $$,
  'P0002', 'card_not_found',
  'redeem : une carte de A est introuvable depuis l''interface de B'
);

-- ----------------------------------------------------------------------------
-- CLIENT (non membre) et ANONYME
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"c6c6c6c6-cccc-4ccc-8ccc-ccccccccc005","role":"authenticated"}';

insert into tap_log (tap) select throws_ok(
  $$ select public.record_visit('a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c6c6c6c6-cccc-4ccc-8ccc-ccccccccc005', 'f6f6f6f6-ffff-4fff-8fff-ffffffffff18') $$,
  '42501', 'forbidden',
  'record_visit : un client ne peut pas se créditer lui-même'
);

reset role;
set local role anon;
set local "request.jwt.claims" = '{}';

insert into tap_log (tap) select throws_ok(
  $$ select * from public.lookup_customer('ZZZZZZ', 'a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1') $$,
  '42501', null,
  'Anonyme ne peut pas exécuter lookup_customer'
);

reset role;

insert into tap_log (tap) select * from finish();

select seq, tap from tap_log order by seq;

rollback;
