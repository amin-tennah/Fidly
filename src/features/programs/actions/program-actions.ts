"use server";

import { revalidatePath } from "next/cache";
import { CLIENT_HOME_PATH } from "@/features/auth/constants";
import { mapProgramRpcError } from "@/features/programs/domain/map-program-error";
import {
  createProgramSchema,
  reorderProgramsSchema,
  setProgramActiveSchema,
  updateProgramSchema,
  type CreateProgramInput,
  type ReorderProgramsInput,
  type SetProgramActiveInput,
  type UpdateProgramInput,
} from "@/features/programs/schemas";
import { PRO_SETTINGS_PATH } from "@/features/restaurants";
import { authorizeRestaurantOwner } from "@/features/restaurants/server";
import { type ActionResult, err, ok } from "@/lib/errors";

/** Settings and the client home both display tiers. */
function revalidatePrograms(): void {
  revalidatePath(PRO_SETTINGS_PATH);
  revalidatePath(CLIENT_HOME_PATH);
}

function fromRpc(error: { readonly message: string } | null): ActionResult<null> {
  if (error) {
    return err(mapProgramRpcError(error.message));
  }
  revalidatePrograms();
  return ok(null);
}

/** Adds a tier at the end of the list (Step 5.4). Owner only; rules enforced by the RPC. */
export async function createProgram(
  input: CreateProgramInput,
): Promise<ActionResult<null>> {
  const guard = await authorizeRestaurantOwner(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = createProgramSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", parsed.error.issues[0]?.message);
  }
  const { error } = await guard.data.rpc("create_loyalty_program", {
    p_restaurant_id: parsed.data.restaurantId,
    p_threshold: parsed.data.threshold,
    p_reward_label: parsed.data.rewardLabel,
  });
  return fromRpc(error);
}

/** Edits the threshold and label of a tier, applied at once to running cards (Q-013). */
export async function updateProgram(
  input: UpdateProgramInput,
): Promise<ActionResult<null>> {
  const guard = await authorizeRestaurantOwner(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = updateProgramSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", parsed.error.issues[0]?.message);
  }
  const { error } = await guard.data.rpc("update_loyalty_program", {
    p_program_id: parsed.data.programId,
    p_threshold: parsed.data.threshold,
    p_reward_label: parsed.data.rewardLabel,
  });
  return fromRpc(error);
}

/** Deactivates or reactivates a tier (never deleted: logs reference it). */
export async function setProgramActive(
  input: SetProgramActiveInput,
): Promise<ActionResult<null>> {
  const guard = await authorizeRestaurantOwner(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = setProgramActiveSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", parsed.error.issues[0]?.message);
  }
  const { error } = await guard.data.rpc("set_loyalty_program_active", {
    p_program_id: parsed.data.programId,
    p_is_active: parsed.data.isActive,
  });
  return fromRpc(error);
}

/** Persists the new order of the active tiers, atomically (no transient duplicate position). */
export async function reorderPrograms(
  input: ReorderProgramsInput,
): Promise<ActionResult<null>> {
  const guard = await authorizeRestaurantOwner(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = reorderProgramsSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", parsed.error.issues[0]?.message);
  }
  const { error } = await guard.data.rpc("reorder_loyalty_programs", {
    p_restaurant_id: parsed.data.restaurantId,
    p_program_ids: parsed.data.programIds,
  });
  return fromRpc(error);
}
