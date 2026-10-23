-- ============================================================================
-- Migration 11 (Étape 5.4) : l'image d'un palier est gérée par sa propre RPC
--   - `update_loyalty_program` ne modifie plus que le seuil et le libellé
--     (modifier un texte ne peut plus effacer ou remplacer l'image par erreur)
--   - `set_loyalty_program_image` : chemin dans le dossier du restaurant, ou NULL
-- ============================================================================

drop function public.update_loyalty_program(uuid, integer, text, text);

create or replace function public.update_loyalty_program(
  p_program_id uuid,
  p_threshold integer,
  p_reward_label text
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

  update public.loyalty_programs
  set threshold = p_threshold,
      reward_label = trim(p_reward_label)
  where id = p_program_id;

  perform private.assert_program_rules(v_restaurant_id);
end;
$$;

create or replace function public.set_loyalty_program_image(
  p_program_id uuid,
  p_reward_image_path text default null
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
  set reward_image_path = p_reward_image_path
  where id = p_program_id;
end;
$$;

revoke all on function public.update_loyalty_program(uuid, integer, text) from public, anon;
revoke all on function public.set_loyalty_program_image(uuid, text) from public, anon;
grant execute on function public.update_loyalty_program(uuid, integer, text) to authenticated;
grant execute on function public.set_loyalty_program_image(uuid, text) to authenticated;
