-- ============================================================================
-- Migration 3 (Étape 2.4) : Trigger de création de profil à l'inscription
-- ============================================================================

-- Génère un code court de 6 caractères sans ambiguïté (alphabet 31 car. sans 0/O/1/I/L)
create or replace function public.generate_short_code()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_alphabet constant text := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  v_bytes bytea;
  v_code text;
  v_i integer;
  v_attempts integer := 0;
begin
  loop
    v_attempts := v_attempts + 1;
    if v_attempts > 25 then
      raise exception 'Unable to generate a unique short_code after 25 attempts';
    end if;

    v_bytes := extensions.gen_random_bytes(6);
    v_code := '';

    for v_i in 0..5 loop
      v_code := v_code || substr(v_alphabet, (get_byte(v_bytes, v_i) % 31) + 1, 1);
    end loop;

    if not exists (
      select 1
      from public.profiles p
      where p.short_code = v_code
    ) then
      return v_code;
    end if;
  end loop;
end;
$$;

revoke all on function public.generate_short_code() from public, anon, authenticated;

-- Crée automatiquement la ligne public.profiles lors d'une inscription dans auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_raw_name text;
  v_display_name text;
  v_qr_token text;
  v_short_code text;
begin
  v_raw_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), '')
  );

  if v_raw_name is not null then
    v_display_name := left(v_raw_name, 60);
  else
    v_display_name := null;
  end if;

  v_qr_token := encode(extensions.gen_random_bytes(24), 'hex');
  v_short_code := public.generate_short_code();

  insert into public.profiles (
    id,
    display_name,
    qr_token,
    short_code
  )
  values (
    new.id,
    v_display_name,
    v_qr_token,
    v_short_code
  );

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

