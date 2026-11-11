-- ============================================================================
-- Étape 5.4 : tests pgTAP des RPC de programmes de fidélité (migration 10)
--   - écriture directe interdite ; création, édition, ordre, désactivation par RPC
--   - règles : seuils strictement croissants, 5 paliers actifs maximum
--   - désactivation : cartes basculées sur le palier suivant, `stamps` conservé (Q-013)
--   - réactivation : cartes avancées reprises par le palier réactivé (Q-015)
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

insert into tap_log (tap) select plan(22);

-- Fixtures (superuser) : R1 vide, R3 avec 3 paliers et une carte, R4 avec 5 paliers actifs
insert into public.restaurants (id, slug, name, category, is_active)
values
  ('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'test-prog-1', 'Resto Programmes 1', 'burger', true),
  ('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'test-prog-3', 'Resto Programmes 3', 'pizza', true),
  ('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'test-prog-4', 'Resto Programmes 4', 'tacos', true);

insert into public.loyalty_programs (id, restaurant_id, position, threshold, reward_label)
values
  ('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 1, 10, 'P1'),
  ('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 2, 20, 'P2'),
  ('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 3, 30, 'P3'),
  ('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 1, 10, 'Q1'),
  ('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb5', 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 2, 20, 'Q2'),
  ('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb6', 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 3, 30, 'Q3'),
  ('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb7', 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 4, 40, 'Q4'),
  ('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb8', 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 5, 50, 'Q5');

insert into auth.users (id, aud, role, email, raw_user_meta_data)
values
  ('c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc1', 'authenticated', 'authenticated', 'prog-owner@test.local', '{"display_name":"Owner"}'::jsonb),
  ('c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc2', 'authenticated', 'authenticated', 'prog-staff@test.local', '{"display_name":"Staff"}'::jsonb),
  ('c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc3', 'authenticated', 'authenticated', 'prog-other@test.local', '{"display_name":"Other"}'::jsonb),
  ('c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc4', 'authenticated', 'authenticated', 'prog-client@test.local', '{"display_name":"Client"}'::jsonb);

insert into public.restaurant_members (restaurant_id, user_id, role)
values
  ('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc1', 'owner'),
  ('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc2', 'staff'),
  ('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc1', 'owner'),
  ('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc1', 'owner'),
  ('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc3', 'owner');

insert into public.loyalty_cards (id, user_id, restaurant_id, current_program_id, stamps, lifetime_visits)
values ('d5d5d5d5-dddd-4ddd-8ddd-ddddddddddd1', 'c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc4',
        'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 13, 13);

-- ----------------------------------------------------------------------------
-- OWNER (restaurants 1, 3 et 4)
-- ----------------------------------------------------------------------------
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated"}';

-- 1-2. Création : positions successives
do $$ begin perform public.create_loyalty_program('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 10, 'Dessert'); end $$;
do $$ begin perform public.create_loyalty_program('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 20, 'Menu'); end $$;

insert into tap_log (tap) select is(
  (select position from public.loyalty_programs where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1' and reward_label = 'Dessert'),
  1,
  'Premier palier créé en position 1'
);

insert into tap_log (tap) select is(
  (select position from public.loyalty_programs where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1' and reward_label = 'Menu'),
  2,
  'Second palier créé en position 2'
);

-- 3-4. Seuils strictement croissants
insert into tap_log (tap) select throws_ok(
  $$ select public.create_loyalty_program('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 20, 'Doublon de seuil') $$,
  'P0001', 'thresholds_not_increasing',
  'Un palier dont le seuil n''est pas supérieur au précédent est refusé'
);

insert into tap_log (tap) select throws_ok(
  $$ select public.update_loyalty_program(
       (select id from public.loyalty_programs where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1' and reward_label = 'Dessert'),
       25, 'Dessert') $$,
  'P0001', 'thresholds_not_increasing',
  'Modifier un seuil au-dessus du palier suivant est refusé'
);

-- 5. Édition autorisée
do $$ begin perform public.update_loyalty_program(
  (select id from public.loyalty_programs where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1' and reward_label = 'Dessert'),
  10, 'Dessert XL'
); end $$;

insert into tap_log (tap) select is(
  (select count(*)::int from public.loyalty_programs where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1' and reward_label = 'Dessert XL'),
  1,
  'Owner peut modifier le libellé d''un palier'
);

-- 6. Réordonnancement : les seuils restent sur les places
do $$ begin perform public.reorder_loyalty_programs(
  'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  array[
    (select id from public.loyalty_programs where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1' and reward_label = 'Menu'),
    (select id from public.loyalty_programs where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1' and reward_label = 'Dessert XL')
  ]
); end $$;

insert into tap_log (tap) select is(
  (select string_agg(reward_label || ':' || position || '/' || threshold, ' ' order by position)
   from public.loyalty_programs where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
  'Menu:1/10 Dessert XL:2/20',
  'Réordonner : positions réécrites, seuils conservés sur les places'
);

-- 7. Ordre invalide (palier manquant)
insert into tap_log (tap) select throws_ok(
  $$ select public.reorder_loyalty_programs(
       'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
       array[(select id from public.loyalty_programs where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1' and reward_label = 'Menu')]) $$,
  '22023', 'invalid_program_order',
  'Un ordre qui n''inclut pas tous les paliers actifs est refusé'
);

-- 8-9. Écriture directe interdite
insert into tap_log (tap) select throws_ok(
  $$ delete from public.loyalty_programs where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1' $$,
  '42501', null,
  'Aucune suppression physique d''un palier, même pour l''owner'
);

insert into tap_log (tap) select throws_ok(
  $$ update public.loyalty_programs set threshold = 99 where restaurant_id = 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1' $$,
  '42501', null,
  'Aucune modification directe d''un palier (passage par RPC)'
);

-- 10-12. Désactivation : cartes basculées, stamps conservés
do $$ begin perform public.set_loyalty_program_active('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb2', false); end $$;

insert into tap_log (tap) select is(
  (select current_program_id::text || '/' || stamps from public.loyalty_cards where id = 'd5d5d5d5-dddd-4ddd-8ddd-ddddddddddd1'),
  'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb3/13',
  'Désactiver P2 : la carte passe sur P3 en gardant ses 13 passages'
);

do $$ begin perform public.set_loyalty_program_active('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb3', false); end $$;

insert into tap_log (tap) select is(
  (select current_program_id::text from public.loyalty_cards where id = 'd5d5d5d5-dddd-4ddd-8ddd-ddddddddddd1'),
  'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
  'Désactiver le dernier palier : la carte boucle sur le premier'
);

do $$ begin perform public.set_loyalty_program_active('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb1', false); end $$;

insert into tap_log (tap) select is(
  (select current_program_id::text from public.loyalty_cards where id = 'd5d5d5d5-dddd-4ddd-8ddd-ddddddddddd1'),
  'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
  'Désactiver le dernier palier actif est permis ; la carte reste inchangée'
);

-- 10 bis. Réactivation (Q-015). Fixtures en superuser : tous les paliers de R3 sont inactifs ;
-- on rend P1 et P2 actifs puis on place la carte sur P3 (palier avancé).
reset role;
update public.loyalty_programs set is_active = true
where id in ('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb3');
update public.loyalty_cards set current_program_id = 'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb3', stamps = 8
where id = 'd5d5d5d5-dddd-4ddd-8ddd-ddddddddddd1';
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated"}';

do $$ begin perform public.set_loyalty_program_active('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb2', true); end $$;

insert into tap_log (tap) select is(
  (select current_program_id::text || '/' || stamps from public.loyalty_cards where id = 'd5d5d5d5-dddd-4ddd-8ddd-ddddddddddd1'),
  'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb2/8',
  'Réactiver P2 (seuil 20) : la carte à 8 passages sur P3 revient sur P2, passages inchangés'
);

reset role;
update public.loyalty_cards set current_program_id = 'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb3', stamps = 25
where id = 'd5d5d5d5-dddd-4ddd-8ddd-ddddddddddd1';
update public.loyalty_programs set is_active = false where id = 'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb2';
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated"}';

do $$ begin perform public.set_loyalty_program_active('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb2', true); end $$;

insert into tap_log (tap) select is(
  (select current_program_id::text from public.loyalty_cards where id = 'd5d5d5d5-dddd-4ddd-8ddd-ddddddddddd1'),
  'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
  'Réactiver P2 : la carte à 25 passages (P2 consommé) reste sur P3'
);

reset role;
update public.loyalty_cards set current_program_id = 'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb1', stamps = 3
where id = 'd5d5d5d5-dddd-4ddd-8ddd-ddddddddddd1';
update public.loyalty_programs set is_active = false where id = 'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb2';
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated"}';

do $$ begin perform public.set_loyalty_program_active('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb2', true); end $$;

insert into tap_log (tap) select is(
  (select current_program_id::text from public.loyalty_cards where id = 'd5d5d5d5-dddd-4ddd-8ddd-ddddddddddd1'),
  'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
  'Réactiver P2 : une carte restée sur un palier plus bas (P1) n''est pas avancée'
);

-- 13. Maximum de 5 paliers actifs
insert into tap_log (tap) select throws_ok(
  $$ select public.create_loyalty_program('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 60, 'Sixième palier') $$,
  'P0001', 'too_many_programs',
  'Un sixième palier actif est refusé'
);

-- 14-16. Image de palier : dossier du restaurant uniquement
do $$ begin perform public.set_loyalty_program_image(
  'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb4',
  'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa4/reward-test.webp'
); end $$;

insert into tap_log (tap) select is(
  (select reward_image_path from public.loyalty_programs where id = 'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb4'),
  'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa4/reward-test.webp',
  'Owner peut associer une image de son dossier à un palier'
);

insert into tap_log (tap) select throws_ok(
  $$ select public.set_loyalty_program_image('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1/reward-test.webp') $$,
  '22023', 'invalid_media_path',
  'Une image d''un autre dossier est refusée'
);

do $$ begin perform public.set_loyalty_program_image('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb4'); end $$;

insert into tap_log (tap) select is(
  (select reward_image_path from public.loyalty_programs where id = 'b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb4'),
  null,
  'Appeler la RPC sans chemin retire l''image'
);

-- ----------------------------------------------------------------------------
-- STAFF du restaurant 1
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc2","role":"authenticated"}';

insert into tap_log (tap) select throws_ok(
  $$ select public.create_loyalty_program('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 30, 'Pirate staff') $$,
  '42501', 'forbidden',
  'Staff ne peut pas créer de palier'
);

-- ----------------------------------------------------------------------------
-- OWNER d'un autre restaurant (R3 uniquement)
-- ----------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"c5c5c5c5-cccc-4ccc-8ccc-ccccccccccc3","role":"authenticated"}';

insert into tap_log (tap) select throws_ok(
  $$ select public.set_loyalty_program_active('b5b5b5b5-bbbb-4bbb-8bbb-bbbbbbbbbbb4', false) $$,
  '42501', 'forbidden',
  'Owner du restaurant 3 ne peut pas désactiver un palier du restaurant 4'
);

-- ----------------------------------------------------------------------------
-- ANONYME
-- ----------------------------------------------------------------------------
set local role anon;
set local "request.jwt.claims" = '{}';

insert into tap_log (tap) select throws_ok(
  $$ select public.create_loyalty_program('a5a5a5a5-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 30, 'Pirate anonyme') $$,
  '42501', null,
  'Anonyme ne peut pas exécuter create_loyalty_program'
);

reset role;

insert into tap_log (tap) select * from finish();

select seq, tap from tap_log order by seq;

rollback;
