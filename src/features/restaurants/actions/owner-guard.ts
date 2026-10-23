import "server-only";
import { listMyRestaurantMemberships } from "@/features/auth/queries/get-session-context";
import { type ActionResult, err, ok } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ServerSupabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

/**
 * Steps (1) and (2) of every restaurant mutation: authenticated user, then `owner`
 * of the target restaurant. The database (RLS, column grants, RPC checks) stays the
 * last line of defence. Zod validation (step 3) is done by the caller.
 */
export async function authorizeRestaurantOwner(
  restaurantId: string,
): Promise<ActionResult<ServerSupabase>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return err("UNAUTHORIZED");
  }

  const memberships = await listMyRestaurantMemberships(data.user.id);
  const isOwner = memberships.some(
    (m) => m.restaurantId === restaurantId && m.role === "owner",
  );
  return isOwner ? ok(supabase) : err("FORBIDDEN");
}
