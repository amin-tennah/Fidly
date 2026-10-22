-- ============================================================================
-- Migration 6 (Étapes 3.4 & 3.6) : Prénom seul depuis Google (Q-010) &
-- RPC d'acceptation des invitations restaurateur (ADR-006)
-- ============================================================================

-- 1. handle_new_user : ne conserve que le prénom (Q-010 : nom de famille non collecté).
--    Priorité : display_name explicite > given_name (OIDC) > 1er mot de full_name / name.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_raw_name text;
  v_qr_token text;
  v_short_code text;
begin
  v_raw_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'given_name'), ''),
    nullif(split_part(trim(new.raw_user_meta_data ->> 'full_name'), ' ', 1), ''),
    nullif(split_part(trim(new.raw_user_meta_data ->> 'name'), ' ', 1), '')
  );

  v_qr_token := encode(extensions.gen_random_bytes(24), 'hex');
  v_short_code := public.generate_short_code();

  insert into public.profiles (id, display_name, qr_token, short_code)
  values (new.id, left(v_raw_name, 60), v_qr_token, v_short_code);

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- 2. Helper interne : email VÉRIFIÉ de l'utilisateur courant (null si non confirmé).
--    Lu depuis auth.users (source de vérité), jamais depuis user_metadata.
create or replace function private.current_verified_email()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select lower(u.email)
  from auth.users u
  where u.id = (select auth.uid())
    and u.email_confirmed_at is not null;
$$;

revoke all on function private.current_verified_email() from public, anon, authenticated;

-- 3. Liste des invitations valides (non acceptées, non expirées) pour l'email vérifié.
create or replace function public.list_my_pending_invitations()
returns table (
  invitation_id uuid,
  restaurant_id uuid,
  restaurant_name text,
  member_role public.restaurant_member_role,
  expires_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  return query
    select i.id, r.id, r.name, i.role, i.expires_at
    from public.restaurant_invitations i
    join public.restaurants r on r.id = i.restaurant_id
    where lower(i.email) = private.current_verified_email()
      and i.accepted_at is null
      and i.expires_at > now()
    order by i.created_at;
end;
$$;

revoke all on function public.list_my_pending_invitations() from public, anon;
grant execute on function public.list_my_pending_invitations() to authenticated;

-- 4. Acceptation atomique d'une invitation (usage unique, durée limitée, email vérifié).
create or replace function public.accept_restaurant_invitation(p_invitation_id uuid)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_email text;
  v_restaurant_id uuid;
  v_role public.restaurant_member_role;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  v_email := private.current_verified_email();

  -- Verrou de ligne : deux acceptations concurrentes ne peuvent pas réussir toutes les deux.
  select i.restaurant_id, i.role
    into v_restaurant_id, v_role
  from public.restaurant_invitations i
  where i.id = p_invitation_id
    and v_email is not null
    and lower(i.email) = v_email
    and i.accepted_at is null
    and i.expires_at > now()
  for update;

  if not found then
    raise exception 'invitation_invalid' using errcode = 'P0001';
  end if;

  insert into public.restaurant_members (restaurant_id, user_id, role)
  values (v_restaurant_id, v_user_id, v_role)
  on conflict (restaurant_id, user_id) do update
    set role = case
      when excluded.role = 'owner'::public.restaurant_member_role then excluded.role
      else public.restaurant_members.role
    end;

  update public.restaurant_invitations
  set accepted_at = now()
  where id = p_invitation_id;

  return v_restaurant_id;
end;
$$;

revoke all on function public.accept_restaurant_invitation(uuid) from public, anon;
grant execute on function public.accept_restaurant_invitation(uuid) to authenticated;

