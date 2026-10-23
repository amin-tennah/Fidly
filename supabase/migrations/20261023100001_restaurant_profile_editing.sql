-- ============================================================================
-- Migration 8 (Étape 5.2 / 5.3) : édition de la fiche restaurant par l'owner
--   - UPDATE de `restaurants` limité par colonne (slug, is_active,
--     subscription_status, address, location ne sont plus modifiables en direct)
--   - RPC `set_restaurant_address` : adresse + coordonnées cohérentes (geography)
--   - `cover_path` (photo de couverture) et contraintes de forme
-- ============================================================================

alter table public.restaurants
  add column cover_path text;

alter table public.restaurants
  add constraint restaurants_opening_hours_object_chk
    check (jsonb_typeof(opening_hours) = 'object');

alter table public.restaurants
  add constraint restaurants_address_length_chk
    check (address is null or char_length(trim(address)) between 1 and 200);

-- Colonnes modifiables en direct (la RLS reste le filtre de ligne : owner ou admin).
-- Les opérations d'administration (is_active, subscription_status, slug) passent
-- par le client service role, côté serveur uniquement (étape 5.5).
revoke update on public.restaurants from anon, authenticated;
grant update (name, category, opening_hours, logo_path, cover_path)
  on public.restaurants to authenticated;

create or replace function public.set_restaurant_address(
  p_restaurant_id uuid,
  p_address text,
  p_lng double precision,
  p_lat double precision
)
returns void
language plpgsql
volatile
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

  if p_lng is null or p_lat is null
     or p_lng not between -180 and 180
     or p_lat not between -90 and 90 then
    raise exception 'invalid_coordinates' using errcode = '22023';
  end if;

  update public.restaurants
  set address = nullif(trim(p_address), ''),
      -- PostGIS : ordre longitude, latitude
      location = extensions.st_setsrid(extensions.st_makepoint(p_lng, p_lat), 4326)::extensions.geography
  where id = p_restaurant_id;
end;
$$;

revoke all on function public.set_restaurant_address(uuid, text, double precision, double precision)
  from public, anon;
grant execute on function public.set_restaurant_address(uuid, text, double precision, double precision)
  to authenticated;
