-- ============================================================================
-- Étapes 3.4 & 3.6 : Tests pgTAP du trigger prénom (Q-010) et des RPC
-- d'invitation restaurateur (ADR-006). Exécutable via `pnpm db:test`.
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
values ('a1a1a1a1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'test-invit-resto', 'Resto Invit', 'burger', true);

insert into auth.users (id, aud, role, email, email_confirmed_at, raw_user_meta_data)
values
  ('c1c1c1c1-cccc-4ccc-8ccc-ccccccccccc1', 'authenticated', 'authenticated', 'Invited@Test.local', now(),
   '{"full_name":"Jean Dupont"}'::jsonb),
  ('c1c1c1c1-cccc-4ccc-8ccc-ccccccccccc2', 'authenticated', 'authenticated', 'intruder@test.local', now(),
   '{"given_name":"Marie","full_name":"Marie Curie"}'::jsonb),
  ('c1c1c1c1-cccc-4ccc-8ccc-ccccccccccc3', 'authenticated', 'authenticated', 'unverified@test.local', null,
   '{}'::jsonb);

insert into public.restaurant_invitations (id, restaurant_id, email, role, expires_at)
values
  ('f1f1f1f1-ffff-4fff-8fff-fffffffffff1', 'a1a1a1a1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'invited@test.local', 'owner', now() + interval '7 days'),
  ('f1f1f1f1-ffff-4fff-8fff-fffffffffff2', 'a1a1a1a1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'invited@test.local', 'owner', now() - interval '1 day'),
  ('f1f1f1f1-ffff-4fff-8fff-fffffffffff3', 'a1a1a1a1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'unverified@test.local', 'owner', now() + interval '7 days');

-- 1. Trigger handle_new_user : prénom seul (Q-010)
insert into tap_log (tap) select is(
  (select display_name from public.profiles where id = 'c1c1c1c1-cccc-4ccc-8ccc-ccccccccccc1'),
  'Jean',
  'Trigger : seul le 1er mot de full_name est conservé (pas de nom de famille)'
);

insert into tap_log (tap) select is(
  (select display_name from public.profiles where id = 'c1c1c1c1-cccc-4ccc-8ccc-ccccccccccc2'),
  'Marie',
  'Trigger : given_name prioritaire sur full_name'
);

insert into tap_log (tap) select ok(
  (select display_name is null from public.profiles where id = 'c1c1c1c1-cccc-4ccc-8ccc-ccccccccccc3'),
  'Trigger : display_name null sans métadonnée (onboarding requis)'
);

-- 2. Anonyme : aucun accès aux RPC
set local role anon;
set local "request.jwt.claims" = '{}';

insert into tap_log (tap) select throws_ok(
  $$ select public.accept_restaurant_invitation('f1f1f1f1-ffff-4fff-8fff-fffffffffff1') $$,
  '42501',
  null,
  'Anonyme ne peut pas exécuter accept_restaurant_invitation'
);

-- 3. Intrus (email différent)
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"c1c1c1c1-cccc-4ccc-8ccc-ccccccccccc2","role":"authenticated"}';

insert into tap_log (tap) select is(
  (select count(*)::int from public.list_my_pending_invitations()),
  0,
  'Intrus : aucune invitation listée pour un autre email'
);

insert into tap_log (tap) select throws_ok(
  $$ select public.accept_restaurant_invitation('f1f1f1f1-ffff-4fff-8fff-fffffffffff1') $$,
  'P0001',
  'invitation_invalid',
  'Intrus : ne peut pas accepter l''invitation d''un autre email'
);

-- 4. Email non vérifié
set local "request.jwt.claims" = '{"sub":"c1c1c1c1-cccc-4ccc-8ccc-ccccccccccc3","role":"authenticated"}';

insert into tap_log (tap) select throws_ok(
  $$ select public.accept_restaurant_invitation('f1f1f1f1-ffff-4fff-8fff-fffffffffff3') $$,
  'P0001',
  'invitation_invalid',
  'Email non vérifié : acceptation refusée'
);

-- 5. Invité légitime (email insensible à la casse)
set local "request.jwt.claims" = '{"sub":"c1c1c1c1-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated"}';

insert into tap_log (tap) select is(
  (select count(*)::int from public.list_my_pending_invitations()),
  1,
  'Invité : seule l''invitation valide (non expirée) est listée'
);

insert into tap_log (tap) select throws_ok(
  $$ select public.accept_restaurant_invitation('f1f1f1f1-ffff-4fff-8fff-fffffffffff2') $$,
  'P0001',
  'invitation_invalid',
  'Invité : invitation expirée refusée'
);

insert into tap_log (tap) select is(
  public.accept_restaurant_invitation('f1f1f1f1-ffff-4fff-8fff-fffffffffff1'),
  'a1a1a1a1-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid,
  'Invité : acceptation OK, retourne le restaurant'
);

insert into tap_log (tap) select is(
  (select role::text from public.restaurant_members
   where restaurant_id = 'a1a1a1a1-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
     and user_id = 'c1c1c1c1-cccc-4ccc-8ccc-ccccccccccc1'),
  'owner',
  'Invité : rattaché comme owner du restaurant'
);

insert into tap_log (tap) select throws_ok(
  $$ select public.accept_restaurant_invitation('f1f1f1f1-ffff-4fff-8fff-fffffffffff1') $$,
  'P0001',
  'invitation_invalid',
  'Invitation à usage unique : seconde acceptation refusée'
);

insert into tap_log (tap) select * from finish();

select seq, tap from tap_log order by seq;

rollback;

