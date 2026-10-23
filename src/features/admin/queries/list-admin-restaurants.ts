import "server-only";
import type { AdminRestaurantRow } from "@/features/admin/types";
import { RESTAURANT_CATEGORY_LABELS } from "@/lib/restaurant-fields";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Lists every restaurant with its owners and its still-valid invitations, newest first.
 * Reads go through the admin's own session (admin RLS policies). Throws on a database
 * error so `error.tsx` is shown instead of an empty back-office.
 */
export async function listAdminRestaurants(): Promise<readonly AdminRestaurantRow[]> {
  const supabase = await createSupabaseServerClient();
  const [restaurants, owners, invitations] = await Promise.all([
    supabase
      .from("restaurants")
      .select("id, name, slug, category")
      .order("created_at", { ascending: false }),
    supabase
      .from("restaurant_members")
      .select("restaurant_id, profiles ( display_name )")
      .eq("role", "owner"),
    supabase
      .from("restaurant_invitations")
      .select("restaurant_id, email, expires_at")
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: true }),
  ]);
  if (restaurants.error || owners.error || invitations.error) {
    throw new Error("Unable to load the back-office restaurants");
  }

  return restaurants.data.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    categoryLabel: RESTAURANT_CATEGORY_LABELS[restaurant.category],
    ownerNames: owners.data
      .filter((o) => o.restaurant_id === restaurant.id)
      .map((o) => o.profiles?.display_name ?? "Gérant sans prénom"),
    pendingInvitations: invitations.data
      .filter((i) => i.restaurant_id === restaurant.id)
      .map((i) => ({ email: i.email, expiresAt: i.expires_at })),
  }));
}
