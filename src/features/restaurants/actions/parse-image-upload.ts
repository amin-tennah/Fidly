import { MAX_UPLOAD_BYTES } from "@/features/restaurants/constants";
import {
  detectImageType,
  type DetectedImageType,
} from "@/features/restaurants/domain/detect-image-type";
import type { ImageKind } from "@/features/restaurants/domain/media-path";
import { uploadImageFieldsSchema } from "@/features/restaurants/schemas";
import { type ActionResult, err, ok } from "@/lib/errors";

export interface ParsedImageUpload {
  readonly restaurantId: string;
  readonly kind: ImageKind;
  readonly bytes: Uint8Array;
  readonly type: DetectedImageType;
}

/**
 * Validates an image upload form: Zod fields, size, and the real format read from the
 * magic bytes (the declared MIME type is client-controlled and never trusted).
 */
export async function parseImageUpload(
  formData: FormData,
): Promise<ActionResult<ParsedImageUpload>> {
  const fields = uploadImageFieldsSchema.safeParse({
    restaurantId: formData.get("restaurantId"),
    kind: formData.get("kind"),
  });
  const file = formData.get("file");
  if (!fields.success || !(file instanceof File)) {
    return err("VALIDATION_ERROR");
  }
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return err("VALIDATION_ERROR", "L'image est vide ou trop lourde.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) {
    return err(
      "VALIDATION_ERROR",
      "Format d'image non pris en charge (JPEG, PNG ou WebP).",
    );
  }
  return ok({ ...fields.data, bytes, type });
}
