-- ============================================================================
-- DEV ONLY (jamais une migration) : attache des cartes de fidélité de test à
-- VOTRE compte pour valider l'écran client (Phase 4).
--
-- Usage : Supabase Dashboard → SQL Editor → coller ce script, modifier les
-- deux lignes « À MODIFIER » ci-dessous, puis Run. Rejouable à volonté.
--
-- Scénarios (v_scenario) :
--   'progress' : Burger 7/10          · Kawa 4/8          (cartes en cours)
--   'unlocked' : Burger 13/10 (vert)  · Kawa 8/8 (vert)   (récompenses débloquées)
--   'chained'  : Burger 13/20 (palier 2) · Kawa 0/8       (après consommation du palier 1)
--   'clean'    : supprime vos cartes de test (écran « Aucune carte »)
--
-- Le script crée les 2 restaurants de démo et leurs 3 programmes s'ils n'existent
-- pas encore (mêmes identifiants que supabase/seed.sql). Il n'écrit que dans
-- loyalty_cards pour l'email indiqué.
-- ============================================================================

do $$
declare
  v_email    text := 'votre.email@exemple.com';  -- À MODIFIER : l'email de votre compte Fidly
  v_scenario text := 'progress';                  -- À MODIFIER : progress | unlocked | chained | clean

  v_user_id uuid;
  v_burger constant uuid := '11111111-1111-4111-8111-111111111101';
  v_kawa   constant uuid := '11111111-1111-4111-8111-111111111102';
  v_burger_p1 constant uuid := '22222222-2222-4222-8222-222222222201';
  v_burger_p2 constant uuid := '22222222-2222-4222-8222-222222222202';
  v_kawa_p1   constant uuid := '22222222-2222-4222-8222-222222222203';
  v_burger_program uuid;
  v_burger_stamps integer;
  v_kawa_stamps integer;
begin
  select u.id into v_user_id from auth.users u where lower(u.email) = lower(v_email);
  if v_user_id is null then
    raise exception 'Aucun compte pour l''email %, vérifiez v_email', v_email;
  end if;

  if v_scenario = 'clean' then
    delete from public.loyalty_cards
    where user_id = v_user_id and restaurant_id in (v_burger, v_kawa);
    raise notice 'Cartes de test supprimées pour %', v_email;
    return;
  end if;

  insert into public.restaurants (id, slug, name, category, address, is_active)
  values
    (v_burger, 'burger-artisan-paris', 'Burger Artisan Paris', 'burger', '14 Rue de Rivoli, 75004 Paris', true),
    (v_kawa, 'kawa-coffee-roasters', 'Kawa Coffee Roasters', 'coffee_shop', '42 Rue des Archives, 75003 Paris', true)
  on conflict do nothing;

  insert into public.loyalty_programs (id, restaurant_id, position, threshold, reward_label, is_active)
  values
    (v_burger_p1, v_burger, 1, 10, 'Menu Burger Classique offert', true),
    (v_burger_p2, v_burger, 2, 20, 'Menu Double Smash + Dessert maison offert', true),
    (v_kawa_p1, v_kawa, 1, 8, 'Boisson chaude de spécialité au choix offerte', true)
  on conflict do nothing;

  select case v_scenario
           when 'progress' then 7
           when 'unlocked' then 13
           when 'chained' then 13
           else null
         end,
         case v_scenario
           when 'progress' then 4
           when 'unlocked' then 8
           when 'chained' then 0
           else null
         end
    into v_burger_stamps, v_kawa_stamps;

  if v_burger_stamps is null then
    raise exception 'Scénario inconnu : % (progress | unlocked | chained | clean)', v_scenario;
  end if;

  v_burger_program := case when v_scenario = 'chained' then v_burger_p2 else v_burger_p1 end;

  insert into public.loyalty_cards
    (user_id, restaurant_id, current_program_id, stamps, lifetime_visits, last_visit_at)
  values
    (v_user_id, v_burger, v_burger_program, v_burger_stamps, v_burger_stamps, now() - interval '1 day'),
    (v_user_id, v_kawa, v_kawa_p1, v_kawa_stamps, v_kawa_stamps, now() - interval '3 days')
  on conflict (user_id, restaurant_id) do update
    set current_program_id = excluded.current_program_id,
        stamps = excluded.stamps,
        lifetime_visits = excluded.lifetime_visits,
        last_visit_at = excluded.last_visit_at;

  raise notice 'Scénario "%" appliqué pour %', v_scenario, v_email;
end;
$$;
