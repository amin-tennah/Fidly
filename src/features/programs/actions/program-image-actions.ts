"use server";

import { revalidatePath } from "next/cache";
import { CLIENT_HOME_PATH } from "@/features/auth/constants";
import { parseImageFile } from "@/features/media/server";
import {
  clearProgramImage,
  replaceProgramImage,
} from "@/features/programs/actions/program-image";
import {
  programImageFieldsSchema,
  type ProgramImageFields,
} from "@/features/programs/schemas";
import { PRO_SETTINGS_PATH } from "@/features/restaurants";
import { authorizeRestaurantOwner } from "@/features/restaurants/server";
import { type ActionResult, err } from "@/lib/errors";

function revalidateImages(result: ActionResult<null>): ActionResult<null> {
  if (result.ok) {
    revalidatePath(PRO_SETTINGS_PATH);
    revalidatePath(CLIENT_HOME_PATH);
  }
  return result;
}

/** Sets the reward image of a tier (Step 5.4). Owner only; the file is re-validated here. */
export async function uploadProgramImage(
  formData: FormData,
): Promise<ActionResult<null>> {
  const restaurantId = formData.get("restaurantId");
  const guard = await authorizeRestaurantOwner(
    typeof restaurantId === "string" ? restaurantId : "",
  );
  if (!guard.ok) {
    return guard;
  }
  const fields = programImageFieldsSchema.safeParse({
    restaurantId,
    programId: formData.get("programId"),
  });
  if (!fields.success) {
    return err("VALIDATION_ERROR");
  }
  const file = await parseImageFile(formData.get("file"));
  if (!file.ok) {
    return file;
  }
  return revalidateImages(await replaceProgramImage(guard.data, fields.data, file.data));
}

/** Removes the reward image of a tier. Owner only. */
export async function removeProgramImage(
  input: ProgramImageFields,
): Promise<ActionResult<null>> {
  const guard = await authorizeRestaurantOwner(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const fields = programImageFieldsSchema.safeParse(input);
  if (!fields.success) {
    return err("VALIDATION_ERROR");
  }
  return revalidateImages(await clearProgramImage(guard.data, fields.data));
}
