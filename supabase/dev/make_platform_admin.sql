-- ============================================================================
-- DEV / EXPLOITATION (jamais une migration) : donne ou retire l'accès super-admin
-- (`/admin`) à un compte Rézone existant.
--
-- Pourquoi du SQL : personne ne peut s'ajouter dans `platform_admins` depuis
-- l'application (aucun droit d'écriture, testé en pgTAP). Seul le SQL Editor du
-- Dashboard Supabase (rôle postgres) le peut.
--
-- Usage : Supabase Dashboard → SQL Editor → coller ce script, modifier les deux
-- lignes « À MODIFIER », puis Run. Rejouable à volonté.
--
-- Prérequis : le compte doit déjà exister (connexion au moins une fois sur /login,
-- ce qui crée son profil). Après l'ajout, rechargez la page : /admin devient accessible.
-- ============================================================================

do $$
declare
  v_email  text    := 'votre.email@exemple.com';  -- À MODIFIER : l'email de votre compte Rézone
  v_enable boolean := true;                        -- À MODIFIER : true = ajouter, false = retirer

  v_user_id uuid;
begin
  select u.id into v_user_id from auth.users u where lower(u.email) = lower(v_email);
  if v_user_id is null then
    raise exception 'Aucun compte pour l''email %, connectez-vous d''abord sur /login', v_email;
  end if;

  if v_enable then
    insert into public.platform_admins (user_id)
    values (v_user_id)
    on conflict (user_id) do nothing;
    raise notice 'Super-admin activé pour %', v_email;
  else
    delete from public.platform_admins where user_id = v_user_id;
    raise notice 'Super-admin retiré pour %', v_email;
  end if;
end;
$$;

-- Vérification : liste des super-admins actuels (emails masqués au-delà du début)
select left(u.email, 3) || '***' as email_masque, pa.created_at
from public.platform_admins pa
join auth.users u on u.id = pa.user_id
order by pa.created_at;
