-- ============================================================================
-- Migration 12 (Phase 6) : scanner et validation de passage, par RPC uniquement
--   - lookup_customer : identifie un client (QR ou code court), sans rien écrire
--     sur les cartes ; échecs comptés (10 / minute / employé) contre le brute-force
--   - record_visit    : +1 passage, carte créée au 1er passage, cooldown 2 h en base
--   - redeem_reward   : consommation d'un palier (ADR-009)
--   - reverse_scan    : annulation par écriture compensatoire (ADR-010, Q-012)
--   Chaque RPC reçoit le restaurant actif : scanner sur l'interface du restaurant A
--   n'agit que sur A, même pour un owner de plusieurs restaurants.
-- ============================================================================

-- Les horodatages des logs et de `last_visit_at` utilisent clock_timestamp() : l'ordre
-- des opérations d'une carte reste strict même au sein d'une seule transaction.

-- Résultat commun des trois RPC d'écriture
create type public.scan_result as (
  log_id uuid,
  card_id uuid,
  program_id uuid,
  reward_label text,
  stamps integer,
  threshold integer,
  is_reward_unlocked boolean,
  last_visit_at timestamptz,
  replayed boolean
);

-- Échecs de recherche client (limitation de débit) : jamais exposée à l'API
create table private.lookup_failures (
  id bigint generated always as identity primary key,
  staff_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table private.lookup_failures enable row level security;

create index lookup_failures_staff_id_created_at_idx
  on private.lookup_failures (staff_id, created_at desc);

-- ----------------------------------------------------------------------------
-- Helpers internes
-- ----------------------------------------------------------------------------
create or replace function private.scan_cooldown()
returns interval
language sql
immutable
set search_path = ''
as $$ select interval '2 hours' $$;

create or replace function private.assert_restaurant_staff(p_restaurant_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  if not private.is_restaurant_member(p_restaurant_id) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
end;
$$;

-- Palier courant effectif d'une carte : le palier lui-même s'il est actif, sinon le
-- palier actif suivant (en conservant `stamps`), sinon le premier (comme computeCardProgress).
create or replace function private.resolve_program(p_restaurant_id uuid, p_program_id uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.id from public.loyalty_programs p
      where p.id = p_program_id and p.restaurant_id = p_restaurant_id and p.is_active),
    (select p.id from public.loyalty_programs p
      where p.restaurant_id = p_restaurant_id and p.is_active
        and p.position > coalesce(
          (select c.position from public.loyalty_programs c where c.id = p_program_id), 0)
      order by p.position limit 1),
    (select p.id from public.loyalty_programs p
      where p.restaurant_id = p_restaurant_id and p.is_active
      order by p.position limit 1)
  );
$$;

create or replace function private.build_scan_result(
  p_card_id uuid,
  p_log_id uuid,
  p_replayed boolean
)
returns public.scan_result
language sql
stable
security definer
set search_path = ''
as $$
  select row(
    p_log_id, c.id, c.current_program_id, p.reward_label, c.stamps, p.threshold,
    c.stamps >= p.threshold, c.last_visit_at, p_replayed
  )::public.scan_result
  from public.loyalty_cards c
  join public.loyalty_programs p on p.id = c.current_program_id
  where c.id = p_card_id;
$$;

revoke all on function private.scan_cooldown() from public, anon, authenticated;
revoke all on function private.assert_restaurant_staff(uuid) from public, anon, authenticated;
revoke all on function private.resolve_program(uuid, uuid) from public, anon, authenticated;
revoke all on function private.build_scan_result(uuid, uuid, boolean)
  from public, anon, authenticated;

-- ----------------------------------------------------------------------------
-- 1. lookup_customer : QR (20 car. base32) ou code court (6 car.), entrée non fiable
-- ----------------------------------------------------------------------------
create or replace function public.lookup_customer(
  p_token_or_code text,
  p_restaurant_id uuid
)
returns table (
  customer_id uuid,
  display_name text,
  card_id uuid,
  program_id uuid,
  reward_label text,
  stamps integer,
  threshold integer,
  is_reward_unlocked boolean,
  last_visit_at timestamptz,
  is_in_cooldown boolean,
  cooldown_remaining_seconds integer
)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_input text;
  v_profile public.profiles%rowtype;
  v_card public.loyalty_cards%rowtype;
  v_program_id uuid;
  v_reward_label text;
  v_threshold integer;
  v_remaining integer;
begin
  perform private.assert_restaurant_staff(p_restaurant_id);

  if (
    select count(*) from private.lookup_failures f
    where f.staff_id = v_uid and f.created_at > now() - interval '1 minute'
  ) >= 10 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  v_input := upper(regexp_replace(left(coalesce(p_token_or_code, ''), 64), '[\s-]', '', 'g'));

  if v_input ~ '^[A-Z2-7]{20}$' then
    select * into v_profile from public.profiles p where p.qr_token = v_input;
  elsif v_input ~ '^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$' then
    select * into v_profile from public.profiles p where p.short_code = v_input;
  end if;

  if v_profile.id is null then
    delete from private.lookup_failures
      where staff_id = v_uid and created_at < now() - interval '1 hour';
    insert into private.lookup_failures (staff_id) values (v_uid);
    return;
  end if;

  select * into v_card from public.loyalty_cards c
  where c.user_id = v_profile.id and c.restaurant_id = p_restaurant_id;

  v_program_id := private.resolve_program(p_restaurant_id, v_card.current_program_id);
  if v_program_id is null then
    raise exception 'no_active_program' using errcode = 'P0001';
  end if;

  select p.reward_label, p.threshold into v_reward_label, v_threshold
  from public.loyalty_programs p where p.id = v_program_id;

  v_remaining := case
    when v_card.last_visit_at is null then 0
    else greatest(0, ceil(extract(epoch from
      (v_card.last_visit_at + private.scan_cooldown() - now())))::integer)
  end;

  return query select
    v_profile.id,
    coalesce(v_profile.display_name, 'Client'),
    v_card.id,
    v_program_id,
    v_reward_label,
    coalesce(v_card.stamps, 0),
    v_threshold,
    coalesce(v_card.stamps, 0) >= v_threshold,
    v_card.last_visit_at,
    v_remaining > 0,
    v_remaining;
end;
$$;

-- ----------------------------------------------------------------------------
-- 2. record_visit : +1 passage (cumul sans plafond), cooldown vérifié en base
-- ----------------------------------------------------------------------------
create or replace function public.record_visit(
  p_restaurant_id uuid,
  p_customer_id uuid,
  p_idempotency_key uuid,
  p_force_cooldown boolean default false
)
returns public.scan_result
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_card public.loyalty_cards%rowtype;
  v_log public.scan_logs%rowtype;
  v_program_id uuid;
  v_in_cooldown boolean;
  v_log_id uuid;
  v_now timestamptz := clock_timestamp();
begin
  perform private.assert_restaurant_staff(p_restaurant_id);

  if not exists (select 1 from public.profiles p where p.id = p_customer_id) then
    raise exception 'customer_not_found' using errcode = 'P0002';
  end if;

  v_program_id := private.resolve_program(p_restaurant_id, null);
  if v_program_id is null then
    raise exception 'no_active_program' using errcode = 'P0001';
  end if;

  -- Création de la carte au 1er passage (sans effet si elle existe), puis verrou de ligne
  insert into public.loyalty_cards (user_id, restaurant_id, current_program_id)
  values (p_customer_id, p_restaurant_id, v_program_id)
  on conflict (user_id, restaurant_id) do nothing;

  select * into v_card from public.loyalty_cards c
  where c.user_id = p_customer_id and c.restaurant_id = p_restaurant_id
  for update;

  -- Idempotence : même clé rejouée = même opération, rien n'est recrédité
  select * into v_log from public.scan_logs l where l.idempotency_key = p_idempotency_key;
  if found then
    if v_log.card_id is distinct from v_card.id
       or v_log.staff_id is distinct from v_uid
       or v_log.type <> 'visit' then
      raise exception 'idempotency_key_conflict' using errcode = 'P0001';
    end if;
    return private.build_scan_result(v_card.id, v_log.id, true);
  end if;

  v_in_cooldown := v_card.last_visit_at is not null
    and v_card.last_visit_at > now() - private.scan_cooldown();
  if v_in_cooldown and not p_force_cooldown then
    raise exception 'cooldown_active' using errcode = 'P0001';
  end if;

  v_program_id := private.resolve_program(p_restaurant_id, v_card.current_program_id);

  update public.loyalty_cards
  set stamps = stamps + 1,
      lifetime_visits = lifetime_visits + 1,
      last_visit_at = v_now,
      current_program_id = v_program_id
  where id = v_card.id;

  insert into public.scan_logs
    (card_id, restaurant_id, program_id, staff_id, type, delta,
     cooldown_overridden, idempotency_key, created_at)
  values
    (v_card.id, p_restaurant_id, v_program_id, v_uid, 'visit', 1,
     v_in_cooldown, p_idempotency_key, v_now)
  returning id into v_log_id;

  return private.build_scan_result(v_card.id, v_log_id, false);
end;
$$;

-- ----------------------------------------------------------------------------
-- 3. redeem_reward : intermédiaire = stamps conservés, palier suivant ;
--    dernier palier = déduction du seuil et boucle sur le premier (ADR-009)
-- ----------------------------------------------------------------------------
create or replace function public.redeem_reward(
  p_restaurant_id uuid,
  p_card_id uuid,
  p_idempotency_key uuid
)
returns public.scan_result
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_card public.loyalty_cards%rowtype;
  v_log public.scan_logs%rowtype;
  v_program public.loyalty_programs%rowtype;
  v_next_id uuid;
  v_delta integer;
  v_log_id uuid;
begin
  perform private.assert_restaurant_staff(p_restaurant_id);

  select * into v_card from public.loyalty_cards c
  where c.id = p_card_id and c.restaurant_id = p_restaurant_id
  for update;
  if not found then
    raise exception 'card_not_found' using errcode = 'P0002';
  end if;

  select * into v_log from public.scan_logs l where l.idempotency_key = p_idempotency_key;
  if found then
    if v_log.card_id is distinct from v_card.id
       or v_log.staff_id is distinct from v_uid
       or v_log.type <> 'reward_redeemed' then
      raise exception 'idempotency_key_conflict' using errcode = 'P0001';
    end if;
    return private.build_scan_result(v_card.id, v_log.id, true);
  end if;

  select * into v_program from public.loyalty_programs p
  where p.id = private.resolve_program(p_restaurant_id, v_card.current_program_id);
  if not found then
    raise exception 'no_active_program' using errcode = 'P0001';
  end if;

  if v_card.stamps < v_program.threshold then
    raise exception 'reward_not_available' using errcode = 'P0001';
  end if;

  select p.id into v_next_id from public.loyalty_programs p
  where p.restaurant_id = p_restaurant_id and p.is_active and p.position > v_program.position
  order by p.position limit 1;

  if v_next_id is null then
    v_delta := -v_program.threshold;
    v_next_id := private.resolve_program(p_restaurant_id, null);
  else
    v_delta := 0;
  end if;

  update public.loyalty_cards
  set stamps = stamps + v_delta, current_program_id = v_next_id
  where id = v_card.id;

  insert into public.scan_logs
    (card_id, restaurant_id, program_id, staff_id, type, delta, idempotency_key, created_at)
  values
    (v_card.id, p_restaurant_id, v_program.id, v_uid, 'reward_redeemed', v_delta,
     p_idempotency_key, clock_timestamp())
  returning id into v_log_id;

  return private.build_scan_result(v_card.id, v_log_id, false);
end;
$$;

-- ----------------------------------------------------------------------------
-- 4. reverse_scan : écriture compensatoire, état de la carte restauré (ADR-010)
--    owner = tout scan de son restaurant ; staff = ses propres scans < 10 min ;
--    seule la dernière opération non annulée d'une carte est annulable
-- ----------------------------------------------------------------------------
create or replace function public.reverse_scan(
  p_restaurant_id uuid,
  p_log_id uuid,
  p_idempotency_key uuid
)
returns public.scan_result
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_log public.scan_logs%rowtype;
  v_existing public.scan_logs%rowtype;
  v_card public.loyalty_cards%rowtype;
  v_latest uuid;
  v_previous_visit timestamptz;
  v_log_id uuid;
begin
  perform private.assert_restaurant_staff(p_restaurant_id);

  select * into v_log from public.scan_logs l
  where l.id = p_log_id and l.restaurant_id = p_restaurant_id;
  if not found then
    raise exception 'log_not_found' using errcode = 'P0002';
  end if;

  if not private.is_restaurant_owner(p_restaurant_id)
     and (v_log.staff_id is distinct from v_uid
          or v_log.created_at <= now() - interval '10 minutes') then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  if v_log.card_id is null or v_log.type = 'reversal' then
    raise exception 'not_reversible' using errcode = 'P0001';
  end if;

  select * into v_card from public.loyalty_cards c
  where c.id = v_log.card_id for update;

  select * into v_existing from public.scan_logs l where l.idempotency_key = p_idempotency_key;
  if found then
    if v_existing.reverses_log_id is distinct from p_log_id
       or v_existing.staff_id is distinct from v_uid then
      raise exception 'idempotency_key_conflict' using errcode = 'P0001';
    end if;
    return private.build_scan_result(v_card.id, v_existing.id, true);
  end if;

  if exists (select 1 from public.scan_logs r where r.reverses_log_id = p_log_id) then
    raise exception 'already_reversed' using errcode = 'P0001';
  end if;

  select l.id into v_latest from public.scan_logs l
  where l.card_id = v_card.id and l.type <> 'reversal'
    and not exists (select 1 from public.scan_logs r where r.reverses_log_id = l.id)
  order by l.created_at desc, l.id desc limit 1;
  if v_latest is distinct from p_log_id then
    raise exception 'not_latest_operation' using errcode = 'P0001';
  end if;

  select max(l.created_at) into v_previous_visit from public.scan_logs l
  where l.card_id = v_card.id and l.type = 'visit' and l.id <> p_log_id
    and not exists (select 1 from public.scan_logs r where r.reverses_log_id = l.id);

  update public.loyalty_cards
  set stamps = stamps - v_log.delta,
      lifetime_visits = lifetime_visits - case when v_log.type = 'visit' then 1 else 0 end,
      last_visit_at = case when v_log.type = 'visit' then v_previous_visit else last_visit_at end,
      current_program_id = v_log.program_id
  where id = v_card.id;

  insert into public.scan_logs
    (card_id, restaurant_id, program_id, staff_id, type, delta,
     reverses_log_id, idempotency_key, created_at)
  values
    (v_card.id, p_restaurant_id, v_log.program_id, v_uid, 'reversal', -v_log.delta,
     p_log_id, p_idempotency_key, clock_timestamp())
  returning id into v_log_id;

  return private.build_scan_result(v_card.id, v_log_id, false);
end;
$$;

-- ----------------------------------------------------------------------------
-- Droits : authentifiés uniquement (le rôle est vérifié dans chaque fonction)
-- ----------------------------------------------------------------------------
revoke all on function public.lookup_customer(text, uuid) from public, anon;
revoke all on function public.record_visit(uuid, uuid, uuid, boolean) from public, anon;
revoke all on function public.redeem_reward(uuid, uuid, uuid) from public, anon;
revoke all on function public.reverse_scan(uuid, uuid, uuid) from public, anon;

grant execute on function public.lookup_customer(text, uuid) to authenticated;
grant execute on function public.record_visit(uuid, uuid, uuid, boolean) to authenticated;
grant execute on function public.redeem_reward(uuid, uuid, uuid) to authenticated;
grant execute on function public.reverse_scan(uuid, uuid, uuid) to authenticated;
