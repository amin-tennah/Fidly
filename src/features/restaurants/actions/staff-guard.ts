import "server-only";
import { listMyRestaurantMemberships } from "@/features/auth/queries/get-session-context";
import type { ServerSupabase } from "@/features/restaurants/actions/owner-guard";
import { type ActionResult, err, ok } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Steps (1) and (2) of every scan action: authenticated user, then member (owner or
 * staff) of the restaurant shown on screen. The RPCs re-check it in the database, and
 * only ever act on this restaurant (an owner of two restaurants scans for the active one).
 */
export async function authorizeRestaurantStaff(
  restaurantId: string,
): Promise<ActionResult<ServerSupabase>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return err("UNAUTHORIZED");
  }

  const memberships = await listMyRestaurantMemberships(data.user.id);
  const isMember = memberships.some((m) => m.restaurantId === restaurantId);
  return isMember ? ok(supabase) : err("FORBIDDEN");
}
