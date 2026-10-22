-- ============================================================================
-- Migration 7 (audit Phase 3) : durcissement du schéma avant les Phases 4-6
--   1. qr_token court (20 car. base32, QR version 1) — ADR-013
--   2. profiles : seule la colonne display_name est modifiable par l'utilisateur
--   3. scan_logs : journal d'audit anonymisable (RGPD) + restaurant_id — ADR-012
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. qr_token : 100 bits d'entropie, alphabet base32 majuscule (mode
--    « alphanumérique » du QR → 20 caractères tiennent en version 1, niveau M)
-- ----------------------------------------------------------------------------
create or replace function public.generate_qr_token()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_alphabet constant text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  v_bytes bytea := extensions.gen_random_bytes(13);
  v_bits text := '';
  v_token text := '';
  v_i integer;
begin
  for v_i in 0..12 loop
    v_bits := v_bits || (get_byte(v_bytes, v_i)::bit(8))::text;
  end loop;

  for v_i in 0..19 loop
    v_token := v_token
      || substr(v_alphabet, (substr(v_bits, v_i * 5 + 1, 5)::bit(5))::integer + 1, 1);
  end loop;

  return v_token;
end;
$$;

revoke all on function public.generate_qr_token() from public, anon, authenticated;

alter table public.profiles drop constraint if exists profiles_qr_token_check;

-- Aucun QR n'est encore distribué : on régénère tous les jetons existants.
update public.profiles set qr_token = public.generate_qr_token();

alter table public.profiles
  add constraint profiles_qr_token_format_chk check (qr_token ~ '^[A-Z2-7]{20}$');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_raw_name text;
begin
  v_raw_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'given_name'), ''),
    nullif(split_part(trim(new.raw_user_meta_data ->> 'full_name'), ' ', 1), ''),
    nullif(split_part(trim(new.raw_user_meta_data ->> 'name'), ' ', 1), '')
  );

  insert into public.profiles (id, display_name, qr_token, short_code)
  values (
    new.id,
    left(v_raw_name, 60),
    public.generate_qr_token(),
    public.generate_short_code()
  );

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- ----------------------------------------------------------------------------
-- 2. profiles : l'utilisateur ne peut écrire que display_name.
--    (signup_restaurant_id alimentera les stats ROI de la Phase 10 : il ne doit
--    pas être modifiable côté client. Le trigger protect_profile_columns reste
--    en défense en profondeur.)
-- ----------------------------------------------------------------------------
revoke update on public.profiles from anon, authenticated;
grant update (display_name) on public.profiles to authenticated;

-- ----------------------------------------------------------------------------
-- 3. scan_logs : restaurant_id + anonymisation à la suppression de compte
-- ----------------------------------------------------------------------------
alter table public.scan_logs
  add column restaurant_id uuid references public.restaurants (id) on delete cascade;

-- Rétro-remplissage (le trigger d'immutabilité est suspendu le temps de la migration).
alter table public.scan_logs disable trigger prevent_scan_logs_before_update;

update public.scan_logs l
set restaurant_id = c.restaurant_id
from public.loyalty_cards c
where c.id = l.card_id;

alter table public.scan_logs enable trigger prevent_scan_logs_before_update;

alter table public.scan_logs alter column restaurant_id set not null;

-- Cohérence garantie par la base : le restaurant du log = le restaurant de la carte.
alter table public.loyalty_cards
  add constraint loyalty_cards_id_restaurant_id_key unique (id, restaurant_id);

alter table public.scan_logs drop constraint if exists scan_logs_card_id_fkey;
alter table public.scan_logs alter column card_id drop not null;
alter table public.scan_logs
  add constraint scan_logs_card_restaurant_fkey
  foreign key (card_id, restaurant_id)
  references public.loyalty_cards (id, restaurant_id)
  on delete set null (card_id);

-- Un employé qui supprime son compte ne bloque plus : son log est anonymisé.
alter table public.scan_logs drop constraint if exists scan_logs_staff_id_fkey;
alter table public.scan_logs alter column staff_id drop not null;
alter table public.scan_logs
  add constraint scan_logs_staff_id_fkey
  foreign key (staff_id) references public.profiles (id) on delete set null;

create index scan_logs_restaurant_id_created_at_idx
  on public.scan_logs (restaurant_id, created_at desc);

-- Immutabilité : seule mutation tolérée = anonymisation (card_id / staff_id
-- passés à NULL par les FK ON DELETE SET NULL lors d'une suppression de compte).
create or replace function public.prevent_scan_logs_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.card_id is null or new.card_id is not distinct from old.card_id)
     and (new.staff_id is null or new.staff_id is not distinct from old.staff_id)
     and (to_jsonb(new) - 'card_id' - 'staff_id') = (to_jsonb(old) - 'card_id' - 'staff_id')
  then
    return new;
  end if;

  raise exception 'scan_logs is immutable: updates are forbidden';
end;
$$;

-- RLS : le personnel lit les logs de son restaurant via restaurant_id, y compris
-- les logs anonymisés (card_id null) ; le client ne lit que ceux de ses cartes.
drop policy if exists "scan_logs_select_card_owner_staff_or_admin" on public.scan_logs;

create policy "scan_logs_select_owner_staff_or_admin"
  on public.scan_logs
  for select
  to authenticated
  using (
    private.is_platform_admin()
    or private.is_restaurant_member(restaurant_id)
    or exists (
      select 1
      from public.loyalty_cards lc
      where lc.id = scan_logs.card_id
        and lc.user_id = (select auth.uid())
    )
  );
