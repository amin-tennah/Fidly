"use server";

import { revalidatePath } from "next/cache";
import { CLIENT_HOME_PATH } from "@/features/auth/constants";
import { authorizeRestaurantOwner } from "@/features/restaurants/actions/owner-guard";
import { parseImageUpload } from "@/features/restaurants/actions/parse-image-upload";
import { storeRestaurantImage } from "@/features/restaurants/actions/store-restaurant-image";
import { PRO_SETTINGS_PATH } from "@/features/restaurants/constants";
import type { ActionResult } from "@/lib/errors";

/**
 * Stores a logo or cover image (Step 5.3). The browser already re-encoded it; the server
 * re-checks everything: owner role, then fields, size and real format (magic bytes).
 */
export async function uploadRestaurantImage(
  formData: FormData,
): Promise<ActionResult<null>> {
  const restaurantId = formData.get("restaurantId");
  const guard = await authorizeRestaurantOwner(
    typeof restaurantId === "string" ? restaurantId : "",
  );
  if (!guard.ok) {
    return guard;
  }
  const parsed = await parseImageUpload(formData);
  if (!parsed.ok) {
    return parsed;
  }

  const stored = await storeRestaurantImage(guard.data, parsed.data);
  if (stored.ok) {
    revalidatePath(PRO_SETTINGS_PATH);
    revalidatePath(CLIENT_HOME_PATH);
  }
  return stored;
}
