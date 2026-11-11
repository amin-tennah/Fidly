-- Q-015 : un palier réactivé reprend les cartes que sa désactivation avait fait avancer.
--
-- Désactiver le palier N déplace les cartes vers le palier suivant (Q-013). Sans cette
-- migration, la réactivation ne faisait rien : les cartes restaient sur le palier suivant
-- alors que leurs passages n'atteignaient pas le seuil du palier réactivé.
--
-- Règle : à la réactivation, une carte du restaurant placée sur un palier de seuil plus
-- élevé, et dont les passages sont inférieurs au seuil du palier réactivé, revient sur lui.
-- Une carte qui a vraiment consommé ce palier a toujours au moins son seuil en passages
-- (compteur cumulatif, ADR-009) : elle ne bouge pas. Les passages ne sont jamais modifiés.

create or replace function public.set_loyalty_program_active(
  p_program_id uuid,
  p_is_active boolean
)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_restaurant_id uuid;
  v_position integer;
  v_threshold integer;
  v_target uuid;
begin
  select restaurant_id, position, threshold into v_restaurant_id, v_position, v_threshold
  from public.loyalty_programs where id = p_program_id;
  if not found then
    raise exception 'program_not_found' using errcode = 'P0002';
  end if;

  perform private.lock_restaurant_for_programs(v_restaurant_id);

  update public.loyalty_programs set is_active = p_is_active where id = p_program_id;

  if p_is_active then
    -- Q-015 : les cartes avancées par la désactivation reviennent sur le palier réactivé
    update public.loyalty_cards c
    set current_program_id = p_program_id
    from public.loyalty_programs current_program
    where c.restaurant_id = v_restaurant_id
      and current_program.id = c.current_program_id
      and current_program.threshold > v_threshold
      and c.stamps < v_threshold;
  else
    -- Palier actif suivant, sinon boucle sur le premier ; sans palier actif, cartes inchangées
    select id into v_target
    from public.loyalty_programs
    where restaurant_id = v_restaurant_id and is_active and position > v_position
    order by position limit 1;

    if v_target is null then
      select id into v_target
      from public.loyalty_programs
      where restaurant_id = v_restaurant_id and is_active
      order by position limit 1;
    end if;

    if v_target is not null then
      update public.loyalty_cards
      set current_program_id = v_target
      where current_program_id = p_program_id;
    end if;
  end if;

  perform private.assert_program_rules(v_restaurant_id);
end;
$$;
