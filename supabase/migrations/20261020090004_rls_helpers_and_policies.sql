-- ============================================================================
-- Migration 4 (Étape 2.5) : Helpers SECURITY DEFINER (schéma `private`) & Policies RLS
-- ============================================================================

-- 1. Schéma interne `private` non exposé par PostgREST (évite l'exposition /rest/v1/rpc/*
--    et supprime les alertes 0028/0029 du Security Advisor Supabase)
create schema if not exists private;
grant usage on schema private to authenticated;

-- Sécurisation de la fonction système Supabase `public.rls_auto_enable()` si présente
do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;

-- Fonctions helpers RLS (SECURITY DEFINER + search_path vide, cf. .cursorrules §6)
create or replace function private.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.platform_admins pa
    where pa.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_platform_admin() from public, anon;
grant execute on function private.is_platform_admin() to authenticated;

create or replace function private.is_restaurant_member(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.restaurant_members rm
    where rm.restaurant_id = p_restaurant_id
      and rm.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_restaurant_member(uuid) from public, anon;
grant execute on function private.is_restaurant_member(uuid) to authenticated;

create or replace function private.is_restaurant_owner(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.restaurant_members rm
    where rm.restaurant_id = p_restaurant_id
      and rm.user_id = (select auth.uid())
      and rm.role = 'owner'
  );
$$;

revoke all on function private.is_restaurant_owner(uuid) from public, anon;
grant execute on function private.is_restaurant_owner(uuid) to authenticated;

-- 2. Protection des colonnes immuables de profiles (qr_token, short_code) hors admin/service_role
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.role()) = 'authenticated' and not private.is_platform_admin() then
    if new.qr_token is distinct from old.qr_token then
      raise exception 'Modifying qr_token directly is forbidden';
    end if;
    if new.short_code is distinct from old.short_code then
      raise exception 'Modifying short_code directly is forbidden';
    end if;
    if new.created_at is distinct from old.created_at then
      raise exception 'Modifying created_at is forbidden';
    end if;
  end if;
  return new;
end;
$$;

create trigger protect_profiles_before_update
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- 3. Protection de l'immutabilité de scan_logs (aucun UPDATE autorisé, cf. .cursorrules §6)
create or replace function public.prevent_scan_logs_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'scan_logs is immutable: updates are forbidden';
end;
$$;

create trigger prevent_scan_logs_before_update
  before update on public.scan_logs
  for each row execute function public.prevent_scan_logs_update();

-- Révocation explicite des privilèges d'écriture directe sur loyalty_cards et scan_logs
revoke insert, update, delete on public.loyalty_cards from anon, authenticated;
revoke insert, update, delete on public.scan_logs from anon, authenticated;
revoke insert, update, delete on public.platform_admins from anon, authenticated;
revoke insert, update, delete on public.restaurant_members from anon, authenticated;

-- ============================================================================
-- 4. Policies RLS par table (1 policy par couple (rôle, opération) pour éviter
--    tout warning multiple_permissive_policies du Performance Advisor)
-- ============================================================================

-- PROFILES
-- Client : lire/modifier son propre profil ; Staff : passe par RPC lookup_customer (Phase 6)
create policy "profiles_select_own_or_admin"
  on public.profiles
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or private.is_platform_admin()
  );

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- PLATFORM_ADMINS
create policy "platform_admins_select_self_or_admin"
  on public.platform_admins
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or private.is_platform_admin()
  );

-- RESTAURANTS
create policy "restaurants_select_anon_active"
  on public.restaurants
  for select
  to anon
  using (is_active = true);

create policy "restaurants_select_authenticated"
  on public.restaurants
  for select
  to authenticated
  using (
    is_active = true
    or private.is_restaurant_member(id)
    or private.is_platform_admin()
  );

create policy "restaurants_insert_admin"
  on public.restaurants
  for insert
  to authenticated
  with check (private.is_platform_admin());

create policy "restaurants_update_owner_or_admin"
  on public.restaurants
  for update
  to authenticated
  using (
    private.is_restaurant_owner(id)
    or private.is_platform_admin()
  )
  with check (
    private.is_restaurant_owner(id)
    or private.is_platform_admin()
  );

create policy "restaurants_delete_admin"
  on public.restaurants
  for delete
  to authenticated
  using (private.is_platform_admin());

-- RESTAURANT_MEMBERS
create policy "restaurant_members_select_member_or_admin"
  on public.restaurant_members
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or private.is_restaurant_member(restaurant_id)
    or private.is_platform_admin()
  );

-- RESTAURANT_INVITATIONS
create policy "restaurant_invitations_select_owner_or_admin"
  on public.restaurant_invitations
  for select
  to authenticated
  using (
    private.is_restaurant_owner(restaurant_id)
    or private.is_platform_admin()
  );

create policy "restaurant_invitations_insert_admin"
  on public.restaurant_invitations
  for insert
  to authenticated
  with check (private.is_platform_admin());

create policy "restaurant_invitations_update_admin"
  on public.restaurant_invitations
  for update
  to authenticated
  using (private.is_platform_admin())
  with check (private.is_platform_admin());

create policy "restaurant_invitations_delete_admin"
  on public.restaurant_invitations
  for delete
  to authenticated
  using (private.is_platform_admin());

-- LOYALTY_PROGRAMS
create policy "loyalty_programs_select_anon"
  on public.loyalty_programs
  for select
  to anon
  using (true);

create policy "loyalty_programs_select_authenticated"
  on public.loyalty_programs
  for select
  to authenticated
  using (true);

create policy "loyalty_programs_insert_owner_or_admin"
  on public.loyalty_programs
  for insert
  to authenticated
  with check (
    private.is_restaurant_owner(restaurant_id)
    or private.is_platform_admin()
  );

create policy "loyalty_programs_update_owner_or_admin"
  on public.loyalty_programs
  for update
  to authenticated
  using (
    private.is_restaurant_owner(restaurant_id)
    or private.is_platform_admin()
  )
  with check (
    private.is_restaurant_owner(restaurant_id)
    or private.is_platform_admin()
  );

create policy "loyalty_programs_delete_owner_or_admin"
  on public.loyalty_programs
  for delete
  to authenticated
  using (
    private.is_restaurant_owner(restaurant_id)
    or private.is_platform_admin()
  );

-- LOYALTY_CARDS (lecture seule : écriture exclusivement via RPC SECURITY DEFINER)
create policy "loyalty_cards_select_owner_staff_or_admin"
  on public.loyalty_cards
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or private.is_restaurant_member(restaurant_id)
    or private.is_platform_admin()
  );

-- SCAN_LOGS (lecture seule & immuable : écriture exclusivement via RPC SECURITY DEFINER)
create policy "scan_logs_select_card_owner_staff_or_admin"
  on public.scan_logs
  for select
  to authenticated
  using (
    private.is_platform_admin()
    or exists (
      select 1
      from public.loyalty_cards lc
      where lc.id = scan_logs.card_id
        and (
          lc.user_id = (select auth.uid())
          or private.is_restaurant_member(lc.restaurant_id)
        )
    )
  );
