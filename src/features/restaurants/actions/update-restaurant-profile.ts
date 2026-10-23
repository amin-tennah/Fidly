"use server";

import { revalidatePath } from "next/cache";
import { CLIENT_HOME_PATH } from "@/features/auth/constants";
import { authorizeRestaurantOwner } from "@/features/restaurants/actions/owner-guard";
import { PRO_SETTINGS_PATH } from "@/features/restaurants/constants";
import {
  updateOpeningHoursSchema,
  updateRestaurantAddressSchema,
  updateRestaurantIdentitySchema,
  type UpdateOpeningHoursInput,
  type UpdateRestaurantAddressInput,
  type UpdateRestaurantIdentityInput,
} from "@/features/restaurants/schemas";
import { type ActionResult, err, ok } from "@/lib/errors";

function revalidateProfile(): void {
  revalidatePath(PRO_SETTINGS_PATH);
  revalidatePath(CLIENT_HOME_PATH);
}

/** Renames the restaurant and sets its category (Step 5.2). Owner only. */
export async function updateRestaurantIdentity(
  input: UpdateRestaurantIdentityInput,
): Promise<ActionResult<null>> {
  const guard = await authorizeRestaurantOwner(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = updateRestaurantIdentitySchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", parsed.error.issues[0]?.message);
  }

  const { error } = await guard.data
    .from("restaurants")
    .update({ name: parsed.data.name, category: parsed.data.category })
    .eq("id", parsed.data.restaurantId);
  if (error) {
    return err("INTERNAL_ERROR");
  }
  revalidateProfile();
  return ok(null);
}

/** Replaces the weekly opening hours (validated JSON, Step 5.2). Owner only. */
export async function updateOpeningHours(
  input: UpdateOpeningHoursInput,
): Promise<ActionResult<null>> {
  const guard = await authorizeRestaurantOwner(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = updateOpeningHoursSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", parsed.error.issues[0]?.message);
  }

  const { error } = await guard.data
    .from("restaurants")
    .update({ opening_hours: parsed.data.openingHours })
    .eq("id", parsed.data.restaurantId);
  if (error) {
    return err("INTERNAL_ERROR");
  }
  revalidateProfile();
  return ok(null);
}

/** Stores the address and its coordinates atomically via RPC (Step 5.2). Owner only. */
export async function updateRestaurantAddress(
  input: UpdateRestaurantAddressInput,
): Promise<ActionResult<null>> {
  const guard = await authorizeRestaurantOwner(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = updateRestaurantAddressSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", parsed.error.issues[0]?.message);
  }

  const { error } = await guard.data.rpc("set_restaurant_address", {
    p_restaurant_id: parsed.data.restaurantId,
    p_address: parsed.data.address,
    p_lng: parsed.data.lng,
    p_lat: parsed.data.lat,
  });
  if (error) {
    return err("INTERNAL_ERROR");
  }
  revalidateProfile();
  return ok(null);
}
