-- ============================================================================
-- Migration 5 (Étape 2.6) : Bucket Storage `restaurant-media` & Policies
-- ============================================================================

-- Helper sécurisé pour extraire l'UUID du restaurant depuis le 1er segment du chemin Storage
create or replace function private.try_parse_uuid(p_value text)
returns uuid
language plpgsql
immutable
set search_path = ''
as $$
begin
  if p_value is null or p_value !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return null;
  end if;
  return p_value::uuid;
end;
$$;

grant execute on function private.try_parse_uuid(text) to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'restaurant-media',
  'restaurant-media',
  true,
  5242880, -- 5 MiB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lecture publique des médias de restaurants (logos, photos de récompenses)
create policy "restaurant_media_select_public"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'restaurant-media');

-- Écriture réservée aux membres du restaurant correspondant au dossier `<restaurant_id>/...`
create policy "restaurant_media_insert_member_or_admin"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'restaurant-media'
    and (
      private.is_platform_admin()
      or private.is_restaurant_member(
        private.try_parse_uuid((storage.foldername(name))[1])
      )
    )
  );

create policy "restaurant_media_update_member_or_admin"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'restaurant-media'
    and (
      private.is_platform_admin()
      or private.is_restaurant_member(
        private.try_parse_uuid((storage.foldername(name))[1])
      )
    )
  )
  with check (
    bucket_id = 'restaurant-media'
    and (
      private.is_platform_admin()
      or private.is_restaurant_member(
        private.try_parse_uuid((storage.foldername(name))[1])
      )
    )
  );

create policy "restaurant_media_delete_member_or_admin"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'restaurant-media'
    and (
      private.is_platform_admin()
      or private.is_restaurant_member(
        private.try_parse_uuid((storage.foldername(name))[1])
      )
    )
  );
