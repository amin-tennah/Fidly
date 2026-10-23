import { MAX_UPLOAD_BYTES } from "@/features/media/constants";
import {
  detectImageType,
  type DetectedImageType,
} from "@/features/media/domain/detect-image-type";
import { type ActionResult, err, ok } from "@/lib/errors";

export interface ParsedImageFile {
  readonly bytes: Uint8Array;
  readonly type: DetectedImageType;
}

/**
 * Validates an uploaded file: it must be a non-empty `File` under the size ceiling, and its
 * real format is read from the magic bytes (the declared MIME type is client-controlled
 * and never trusted).
 */
export async function parseImageFile(
  entry: FormDataEntryValue | null,
): Promise<ActionResult<ParsedImageFile>> {
  if (!(entry instanceof File)) {
    return err("VALIDATION_ERROR");
  }
  if (entry.size === 0 || entry.size > MAX_UPLOAD_BYTES) {
    return err("VALIDATION_ERROR", "L'image est vide ou trop lourde.");
  }

  const bytes = new Uint8Array(await entry.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) {
    return err(
      "VALIDATION_ERROR",
      "Format d'image non pris en charge (JPEG, PNG ou WebP).",
    );
  }
  return ok({ bytes, type });
}
