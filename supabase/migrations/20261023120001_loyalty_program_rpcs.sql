-- ============================================================================
-- Migration 10 (Étape 5.4) : écriture des programmes de fidélité par RPC uniquement
--   - plus d'INSERT / UPDATE / DELETE direct sur `loyalty_programs`
--   - RPC : create / update / (dés)activation / réordonnancement
--   - règles (Session 18) : au plus 5 paliers actifs, seuils strictement croissants
--     selon l'ordre ; désactiver le dernier palier actif reste permis
--   - désactivation : les cartes du palier basculent sur le palier actif suivant en
--     conservant `stamps` (Q-013) ; jamais de suppression physique (logs, FK RESTRICT)
--   - réordonnancement : les seuils restent sur les places (ADR-009)
-- ============================================================================

drop policy if exists "loyalty_programs_insert_owner_or_admin" on public.loyalty_programs;
drop policy if exists "loyalty_programs_update_owner_or_admin" on public.loyalty_programs;
drop policy if exists "loyalty_programs_delete_owner_or_admin" on public.loyalty_programs;

revoke insert, update, delete on public.loyalty_programs from anon, authenticated;

-- Helpers internes (jamais appelables directement depuis l'API)
create or replace function private.assert_program_rules(p_restaurant_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    select count(*)
    from public.loyalty_programs
    where restaurant_id = p_restaurant_id and is_active
  ) > 5 then
    raise exception 'too_many_programs' using errcode = 'P0001';
  end if;

  if exists (
    select 1
    from (
      select threshold,
             lag(threshold) over (order by position) as previous_threshold
      from public.loyalty_programs
      where restaurant_id = p_restaurant_id and is_active
    ) ordered
    where previous_threshold is not null and threshold <= previous_threshold
  ) then
    raise exception 'thresholds_not_increasing' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function private.assert_program_rules(uuid) from public, anon, authenticated;

-- Authentifie, vérifie owner/admin, puis verrouille le restaurant (sérialise les écritures).
create or replace function private.lock_restaurant_for_programs(p_restaurant_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  if not (
    private.is_restaurant_owner(p_restaurant_id)
    or private.is_platform_admin()
  ) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  perform 1 from public.restaurants where id = p_restaurant_id for update;
  if not found then
    raise exception 'restaurant_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function private.lock_restaurant_for_programs(uuid) from public, anon, authenticated;

-- Une image de récompense doit se trouver dans le dossier du restaurant.
create or replace function private.assert_media_path(p_restaurant_id uuid, p_path text)
returns void
language plpgsql
immutable
set search_path = ''
as $$
begin
  if p_path is not null and (
    p_path not like p_restaurant_id::text || '/%'
    or position('..' in p_path) > 0
    or char_length(p_path) > 200
  ) then
    raise exception 'invalid_media_path' using errcode = '22023';
  end if;
end;
$$;

revoke all on function private.assert_media_path(uuid, text) from public, anon, authenticated;

-- 1. Création : position = dernière + 1 (tous paliers confondus, contrainte UNIQUE)
create or replace function public.create_loyalty_program(
  p_restaurant_id uuid,
  p_threshold integer,
  p_reward_label text,
  p_reward_image_path text default null
)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  perform private.lock_restaurant_for_programs(p_restaurant_id);
  perform private.assert_media_path(p_restaurant_id, p_reward_image_path);

  insert into public.loyalty_programs
    (restaurant_id, position, threshold, reward_label, reward_image_path)
  select p_restaurant_id, coalesce(max(position), 0) + 1, p_threshold,
         trim(p_reward_label), p_reward_image_path
  from public.loyalty_programs
  where restaurant_id = p_restaurant_id
  returning id into v_id;

  perform private.assert_program_rules(p_restaurant_id);
  return v_id;
end;
$$;

-- 2. Édition : application immédiate aux cartes en cours (Q-013), `stamps` conservé
create or replace function public.update_loyalty_program(
  p_program_id uuid,
  p_threshold integer,
  p_reward_label text,
  p_reward_image_path text
)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_restaurant_id uuid;
begin
  select restaurant_id into v_restaurant_id
  from public.loyalty_programs where id = p_program_id;
  if not found then
    raise exception 'program_not_found' using errcode = 'P0002';
  end if;

  perform private.lock_restaurant_for_programs(v_restaurant_id);
  perform private.assert_media_path(v_restaurant_id, p_reward_image_path);

  update public.loyalty_programs
  set threshold = p_threshold,
      reward_label = trim(p_reward_label),
      reward_image_path = p_reward_image_path
  where id = p_program_id;

  perform private.assert_program_rules(v_restaurant_id);
end;
$$;

-- 3. Désactivation / réactivation (soft delete)
create or replace function public.set_loyalty_program_active(
  p_program_id uuid,
  p_is_active boolean
)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_restaurant_id uuid;
  v_position integer;
  v_target uuid;
begin
  select restaurant_id, position into v_restaurant_id, v_position
  from public.loyalty_programs where id = p_program_id;
  if not found then
    raise exception 'program_not_found' using errcode = 'P0002';
  end if;

  perform private.lock_restaurant_for_programs(v_restaurant_id);

  update public.loyalty_programs set is_active = p_is_active where id = p_program_id;

  if not p_is_active then
    -- Palier actif suivant, sinon boucle sur le premier ; sans palier actif, cartes inchangées
    select id into v_target
    from public.loyalty_programs
    where restaurant_id = v_restaurant_id and is_active and position > v_position
    order by position limit 1;

    if v_target is null then
      select id into v_target
      from public.loyalty_programs
      where restaurant_id = v_restaurant_id and is_active
      order by position limit 1;
    end if;

    if v_target is not null then
      update public.loyalty_cards
      set current_program_id = v_target
      where current_program_id = p_program_id;
    end if;
  end if;

  perform private.assert_program_rules(v_restaurant_id);
end;
$$;

-- 4. Réordonnancement : la liste doit contenir exactement les paliers actifs ; les seuils
--    restent attachés aux places (le palier déplacé prend le seuil de sa nouvelle place).
create or replace function public.reorder_loyalty_programs(
  p_restaurant_id uuid,
  p_program_ids uuid[]
)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_expected integer;
  v_thresholds integer[];
begin
  perform private.lock_restaurant_for_programs(p_restaurant_id);

  select count(*), coalesce(array_agg(threshold order by position), '{}')
    into v_expected, v_thresholds
  from public.loyalty_programs
  where restaurant_id = p_restaurant_id and is_active;

  if coalesce(cardinality(p_program_ids), 0) <> v_expected
     or (select count(distinct x) from unnest(p_program_ids) as x) <> v_expected
     or exists (
       select 1 from unnest(p_program_ids) as x
       where not exists (
         select 1 from public.loyalty_programs p
         where p.id = x and p.restaurant_id = p_restaurant_id and p.is_active
       )
     ) then
    raise exception 'invalid_program_order' using errcode = '22023';
  end if;

  -- Décalage puis réécriture : aucune violation transitoire de UNIQUE(restaurant_id, position)
  update public.loyalty_programs
  set position = position + 1000000
  where restaurant_id = p_restaurant_id;

  update public.loyalty_programs p
  set position = target.new_position
  from (
    select x.id, x.ord::integer as new_position
    from unnest(p_program_ids) with ordinality as x(id, ord)
    union all
    select i.id, v_expected + (row_number() over (order by i.position))::integer
    from public.loyalty_programs i
    where i.restaurant_id = p_restaurant_id and not i.is_active
  ) target
  where p.id = target.id;

  update public.loyalty_programs
  set threshold = v_thresholds[position]
  where restaurant_id = p_restaurant_id and is_active;

  perform private.assert_program_rules(p_restaurant_id);
end;
$$;

revoke all on function public.create_loyalty_program(uuid, integer, text, text) from public, anon;
revoke all on function public.update_loyalty_program(uuid, integer, text, text) from public, anon;
revoke all on function public.set_loyalty_program_active(uuid, boolean) from public, anon;
revoke all on function public.reorder_loyalty_programs(uuid, uuid[]) from public, anon;

grant execute on function public.create_loyalty_program(uuid, integer, text, text) to authenticated;
grant execute on function public.update_loyalty_program(uuid, integer, text, text) to authenticated;
grant execute on function public.set_loyalty_program_active(uuid, boolean) to authenticated;
grant execute on function public.reorder_loyalty_programs(uuid, uuid[]) to authenticated;
