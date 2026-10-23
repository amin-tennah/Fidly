"use server";

import { revalidatePath } from "next/cache";
import { authorizePlatformAdmin } from "@/features/admin/actions/admin-guard";
import {
  insertOwnerInvitation,
  insertRestaurantWithFreeSlug,
} from "@/features/admin/actions/admin-writes";
import {
  createRestaurantSchema,
  inviteOwnerSchema,
  type CreateRestaurantInput,
  type InviteOwnerInput,
} from "@/features/admin/schemas";
import type { CreatedRestaurant } from "@/features/admin/types";
import { ADMIN_HOME_PATH } from "@/features/auth/constants";
import { type ActionResult, err } from "@/lib/errors";

/**
 * Creates a restaurant and invites its owner (Step 5.5, ADR-006). If the invitation cannot
 * be issued the new restaurant is removed again, so no ownerless restaurant is left behind.
 */
export async function createRestaurant(
  input: CreateRestaurantInput,
): Promise<ActionResult<CreatedRestaurant>> {
  const guard = await authorizePlatformAdmin();
  if (!guard.ok) {
    return guard;
  }
  const parsed = createRestaurantSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", parsed.error.issues[0]?.message);
  }

  const { supabase, userId } = guard.data;
  const created = await insertRestaurantWithFreeSlug(supabase, parsed.data);
  if (!created.ok) {
    return created;
  }
  const invited = await insertOwnerInvitation(supabase, {
    restaurantId: created.data.restaurantId,
    email: parsed.data.ownerEmail,
    invitedBy: userId,
  });
  if (!invited.ok) {
    await supabase.from("restaurants").delete().eq("id", created.data.restaurantId);
    return invited;
  }
  revalidatePath(ADMIN_HOME_PATH);
  return created;
}

/** Invites an (additional) owner of an existing restaurant, e.g. when an invitation expired. */
export async function inviteOwner(input: InviteOwnerInput): Promise<ActionResult<null>> {
  const guard = await authorizePlatformAdmin();
  if (!guard.ok) {
    return guard;
  }
  const parsed = inviteOwnerSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", parsed.error.issues[0]?.message);
  }

  const invited = await insertOwnerInvitation(guard.data.supabase, {
    restaurantId: parsed.data.restaurantId,
    email: parsed.data.email,
    invitedBy: guard.data.userId,
  });
  if (invited.ok) {
    revalidatePath(ADMIN_HOME_PATH);
  }
  return invited;
}
