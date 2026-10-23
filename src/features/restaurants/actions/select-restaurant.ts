"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { PRO_HOME_PATH } from "@/features/auth/constants";
import { listMyRestaurantMemberships } from "@/features/auth/queries/get-session-context";
import {
  ACTIVE_RESTAURANT_COOKIE,
  ACTIVE_RESTAURANT_COOKIE_MAX_AGE,
} from "@/features/restaurants/constants";
import {
  selectRestaurantSchema,
  type SelectRestaurantInput,
} from "@/features/restaurants/schemas";
import { type ActionResult, err, ok } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Remembers the restaurant displayed in the pro space (Step 5.1). */
export async function selectActiveRestaurant(
  input: SelectRestaurantInput,
): Promise<ActionResult<null>> {
  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return err("UNAUTHORIZED");
  }

  const parsed = selectRestaurantSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", parsed.error.issues[0]?.message);
  }

  const memberships = await listMyRestaurantMemberships(authData.user.id);
  if (!memberships.some((m) => m.restaurantId === parsed.data.restaurantId)) {
    return err("FORBIDDEN");
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_RESTAURANT_COOKIE, parsed.data.restaurantId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: PRO_HOME_PATH,
    maxAge: ACTIVE_RESTAURANT_COOKIE_MAX_AGE,
  });
  revalidatePath(PRO_HOME_PATH, "layout");
  return ok(null);
}
