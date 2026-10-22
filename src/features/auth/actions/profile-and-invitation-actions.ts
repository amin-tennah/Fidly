"use server";

import { revalidatePath } from "next/cache";
import {
  CLIENT_HOME_PATH,
  INVITATION_PATH,
  LOGIN_PATH,
  ONBOARDING_PATH,
  PRO_HOME_PATH,
} from "@/features/auth/constants";
import {
  acceptInvitationSchema,
  type AcceptInvitationInput,
  updateDisplayNameSchema,
  type UpdateDisplayNameInput,
} from "@/features/auth/schemas";
import { type ActionResult, err, ok } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Updates `profiles.display_name` for the authenticated user (Step 3.4).
 * Checks: (1) auth via `getUser()`, (2) own row via RLS, (3) Zod validation.
 */
export async function updateDisplayName(
  input: UpdateDisplayNameInput,
): Promise<ActionResult<{ readonly displayName: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return err("UNAUTHORIZED");
  }

  const parsed = updateDisplayNameSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return err("VALIDATION_ERROR", firstIssue?.message);
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: parsed.data.displayName })
    .eq("id", authData.user.id);

  if (error) {
    return err("INTERNAL_ERROR");
  }

  revalidatePath(CLIENT_HOME_PATH);
  revalidatePath(ONBOARDING_PATH);
  return ok({ displayName: parsed.data.displayName });
}

/**
 * Accepts a pending restaurant invitation atomically via RPC (Step 3.6, ADR-006).
 */
export async function acceptRestaurantInvitation(
  input: AcceptInvitationInput,
): Promise<ActionResult<{ readonly restaurantId: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return err("UNAUTHORIZED");
  }

  const parsed = acceptInvitationSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return err("VALIDATION_ERROR", firstIssue?.message);
  }

  const { data, error } = await supabase.rpc("accept_restaurant_invitation", {
    p_invitation_id: parsed.data.invitationId,
  });

  if (error || !data) {
    return err("INVITATION_INVALID");
  }

  revalidatePath(INVITATION_PATH);
  revalidatePath(PRO_HOME_PATH);
  return ok({ restaurantId: data });
}

/** Signs out the current user and clears session cookies (Step 3.7). */
export async function signOutUser(): Promise<ActionResult<null>> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return err("INTERNAL_ERROR");
  }
  revalidatePath(CLIENT_HOME_PATH);
  revalidatePath(LOGIN_PATH);
  return ok(null);
}
