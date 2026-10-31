-- ============================================================================
-- Migration 14 (Phase 7, retour d'essai) : une annulation = une seule ligne
--   Le journal affichait la ligne d'origine barrée ET une ligne « Annulation ».
--   `list_scan_logs` ne renvoie plus les écritures compensatoires : la ligne
--   d'origine porte l'état « annulé », l'heure et le prénom de l'employé qui a
--   annulé. L'écriture compensatoire reste en base (audit, ADR-010).
--   Le type de retour change : la fonction est recréée.
-- ============================================================================

drop function public.list_scan_logs(uuid, timestamptz, uuid, integer);

create function public.list_scan_logs(
  p_restaurant_id uuid,
  p_before_at timestamptz default null,
  p_before_id uuid default null,
  p_limit integer default 26
)
returns table (
  log_id uuid,
  created_at timestamptz,
  type public.scan_log_type,
  delta integer,
  cooldown_overridden boolean,
  reward_label text,
  customer_name text,
  staff_name text,
  is_reversed boolean,
  reversed_at timestamptz,
  reversed_by_name text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.assert_restaurant_staff(p_restaurant_id);

  return query
  select
    l.id,
    l.created_at,
    l.type,
    l.delta,
    l.cooldown_overridden,
    p.reward_label,
    cp.display_name,
    sp.display_name,
    r.id is not null,
    r.created_at,
    rp.display_name
  from public.scan_logs l
  join public.loyalty_programs p on p.id = l.program_id
  left join public.loyalty_cards c on c.id = l.card_id
  left join public.profiles cp on cp.id = c.user_id
  left join public.profiles sp on sp.id = l.staff_id
  left join public.scan_logs r on r.reverses_log_id = l.id
  left join public.profiles rp on rp.id = r.staff_id
  where l.restaurant_id = p_restaurant_id
    and l.type <> 'reversal'
    and (
      p_before_at is null
      or p_before_id is null
      or (l.created_at, l.id) < (p_before_at, p_before_id)
    )
  order by l.created_at desc, l.id desc
  limit greatest(1, least(coalesce(p_limit, 26), 51));
end;
$$;

revoke all on function public.list_scan_logs(uuid, timestamptz, uuid, integer)
  from public, anon;
grant execute on function public.list_scan_logs(uuid, timestamptz, uuid, integer)
  to authenticated;
