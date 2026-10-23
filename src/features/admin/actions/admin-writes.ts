import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SLUG_MAX_ATTEMPTS, UNIQUE_VIOLATION_CODE } from "@/features/admin/constants";
import { invitationExpiry } from "@/features/admin/domain/easel";
import { slugCandidate, slugify } from "@/features/admin/domain/slugify";
import type { CreateRestaurantInput } from "@/features/admin/schemas";
import type { CreatedRestaurant } from "@/features/admin/types";
import { type ActionResult, err, ok } from "@/lib/errors";
import type { Database } from "@/types/database.types";

type Supabase = SupabaseClient<Database>;

const FOREIGN_KEY_VIOLATION_CODE = "23503";

/**
 * Creates the restaurant under the first free slug (`name`, `name-2`, …). Only a unique
 * violation moves to the next candidate; any other error stops at once.
 */
export async function insertRestaurantWithFreeSlug(
  supabase: Supabase,
  input: Pick<CreateRestaurantInput, "name" | "category">,
): Promise<ActionResult<CreatedRestaurant>> {
  const base = slugify(input.name);
  for (let attempt = 0; attempt < SLUG_MAX_ATTEMPTS; attempt += 1) {
    const { data, error } = await supabase
      .from("restaurants")
      .insert({
        slug: slugCandidate(base, attempt),
        name: input.name,
        category: input.category,
      })
      .select("id, slug")
      .single();
    if (!error) {
      return ok({ restaurantId: data.id, slug: data.slug });
    }
    if (error.code !== UNIQUE_VIOLATION_CODE) {
      return err("INTERNAL_ERROR");
    }
  }
  return err(
    "VALIDATION_ERROR",
    "Impossible de trouver un identifiant libre pour ce nom. Modifiez-le légèrement.",
  );
}

export interface OwnerInvitation {
  readonly restaurantId: string;
  readonly email: string;
  readonly invitedBy: string;
}

/** Issues an `owner` invitation bound to an email; it stays valid for a limited time. */
export async function insertOwnerInvitation(
  supabase: Supabase,
  invitation: OwnerInvitation,
): Promise<ActionResult<null>> {
  const { error } = await supabase.from("restaurant_invitations").insert({
    restaurant_id: invitation.restaurantId,
    email: invitation.email,
    role: "owner",
    invited_by: invitation.invitedBy,
    expires_at: invitationExpiry(new Date()).toISOString(),
  });
  if (error?.code === FOREIGN_KEY_VIOLATION_CODE) {
    return err("VALIDATION_ERROR", "Établissement introuvable.");
  }
  return error ? err("INTERNAL_ERROR") : ok(null);
}
