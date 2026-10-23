-- ============================================================================
-- Migration 9 (Étape 5.3) : écriture dans `restaurant-media` réservée aux owners
-- (la migration 5 l'ouvrait à tout membre, `staff` compris ; la roadmap exige owner)
-- Dossier attendu : `<restaurant_id>/<fichier>`. La lecture publique est inchangée.
-- ============================================================================

drop policy if exists "restaurant_media_insert_member_or_admin" on storage.objects;
drop policy if exists "restaurant_media_update_member_or_admin" on storage.objects;
drop policy if exists "restaurant_media_delete_member_or_admin" on storage.objects;

create policy "restaurant_media_insert_owner_or_admin"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'restaurant-media'
    and (
      private.is_platform_admin()
      or private.is_restaurant_owner(
        private.try_parse_uuid((storage.foldername(name))[1])
      )
    )
  );

create policy "restaurant_media_update_owner_or_admin"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'restaurant-media'
    and (
      private.is_platform_admin()
      or private.is_restaurant_owner(
        private.try_parse_uuid((storage.foldername(name))[1])
      )
    )
  )
  with check (
    bucket_id = 'restaurant-media'
    and (
      private.is_platform_admin()
      or private.is_restaurant_owner(
        private.try_parse_uuid((storage.foldername(name))[1])
      )
    )
  );

create policy "restaurant_media_delete_owner_or_admin"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'restaurant-media'
    and (
      private.is_platform_admin()
      or private.is_restaurant_owner(
        private.try_parse_uuid((storage.foldername(name))[1])
      )
    )
  );
