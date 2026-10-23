import { parseImageFile, type ParsedImageFile } from "@/features/media/server";
import { uploadImageFieldsSchema } from "@/features/restaurants/schemas";
import type { RestaurantImageKind } from "@/features/restaurants/types";
import { type ActionResult, err, ok } from "@/lib/errors";

export interface ParsedImageUpload extends ParsedImageFile {
  readonly restaurantId: string;
  readonly kind: RestaurantImageKind;
}

/** Validates the fields (Zod) and the file (size, real format) of a logo/cover upload. */
export async function parseImageUpload(
  formData: FormData,
): Promise<ActionResult<ParsedImageUpload>> {
  const fields = uploadImageFieldsSchema.safeParse({
    restaurantId: formData.get("restaurantId"),
    kind: formData.get("kind"),
  });
  if (!fields.success) {
    return err("VALIDATION_ERROR");
  }
  const file = await parseImageFile(formData.get("file"));
  return file.ok ? ok({ ...fields.data, ...file.data }) : file;
}
