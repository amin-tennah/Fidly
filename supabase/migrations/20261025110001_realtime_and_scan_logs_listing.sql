-- ============================================================================
-- Migration 13 (Phase 7) : temps réel et journal d'audit
--   - publication Realtime de `loyalty_cards` (jauge du client) et `scan_logs`
--     (journal du restaurant) : la RLS existante filtre les événements par abonné
--   - RPC `list_scan_logs` : page de journal d'un restaurant avec prénom du client,
--     prénom de l'employé et état « annulé » (l'employé ne lit pas `profiles`)
-- ============================================================================

alter publication supabase_realtime add table public.loyalty_cards, public.scan_logs;

-- Pagination par curseur (created_at, id) : stable même quand de nouveaux logs arrivent.
-- `p_limit` est borné à 51 ; l'appelant demande une ligne de plus que la page affichée
-- pour savoir s'il reste des logs plus anciens.
create or replace function public.list_scan_logs(
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
  reverses_log_id uuid,
  is_reversed boolean,
  reversed_at timestamptz
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
    l.reverses_log_id,
    r.id is not null,
    r.created_at
  from public.scan_logs l
  join public.loyalty_programs p on p.id = l.program_id
  left join public.loyalty_cards c on c.id = l.card_id
  left join public.profiles cp on cp.id = c.user_id
  left join public.profiles sp on sp.id = l.staff_id
  left join public.scan_logs r on r.reverses_log_id = l.id
  where l.restaurant_id = p_restaurant_id
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
