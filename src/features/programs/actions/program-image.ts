import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  removeMediaFile,
  storeMediaFile,
  type ParsedImageFile,
} from "@/features/media/server";
import { mapProgramRpcError } from "@/features/programs/domain/map-program-error";
import type { ProgramImageFields } from "@/features/programs/schemas";
import { type ActionResult, err, ok } from "@/lib/errors";
import type { Database } from "@/types/database.types";

type Supabase = SupabaseClient<Database>;

/** Current image path of a tier of this restaurant; `PROGRAM_NOT_FOUND` for any other tier. */
async function readImagePath(
  supabase: Supabase,
  fields: ProgramImageFields,
): Promise<ActionResult<string | null>> {
  const { data, error } = await supabase
    .from("loyalty_programs")
    .select("reward_image_path")
    .eq("id", fields.programId)
    .eq("restaurant_id", fields.restaurantId)
    .maybeSingle();
  if (error) {
    return err("INTERNAL_ERROR");
  }
  return data ? ok(data.reward_image_path) : err("PROGRAM_NOT_FOUND");
}

/** Stores a new reward image, points the tier to it, then removes the previous file. */
export async function replaceProgramImage(
  supabase: Supabase,
  fields: ProgramImageFields,
  file: ParsedImageFile,
): Promise<ActionResult<null>> {
  const current = await readImagePath(supabase, fields);
  if (!current.ok) {
    return current;
  }
  const stored = await storeMediaFile(supabase, {
    restaurantId: fields.restaurantId,
    kind: "reward",
    ...file,
  });
  if (!stored.ok) {
    return stored;
  }

  const { error } = await supabase.rpc("set_loyalty_program_image", {
    p_program_id: fields.programId,
    p_reward_image_path: stored.data.path,
  });
  if (error) {
    await removeMediaFile(supabase, fields.restaurantId, stored.data.path);
    return err(mapProgramRpcError(error.message));
  }
  await removeMediaFile(supabase, fields.restaurantId, current.data);
  return ok(null);
}

/** Removes the reward image of a tier (the RPC called without a path clears it). */
export async function clearProgramImage(
  supabase: Supabase,
  fields: ProgramImageFields,
): Promise<ActionResult<null>> {
  const current = await readImagePath(supabase, fields);
  if (!current.ok) {
    return current;
  }
  const { error } = await supabase.rpc("set_loyalty_program_image", {
    p_program_id: fields.programId,
  });
  if (error) {
    return err(mapProgramRpcError(error.message));
  }
  await removeMediaFile(supabase, fields.restaurantId, current.data);
  return ok(null);
}
