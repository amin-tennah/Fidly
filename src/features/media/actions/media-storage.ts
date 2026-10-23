import "server-only";
import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  IMAGE_EXTENSIONS,
  type DetectedImageType,
} from "@/features/media/domain/detect-image-type";
import {
  buildMediaPath,
  isOwnMediaPath,
  type ImageKind,
} from "@/features/media/domain/media-path";
import { type ActionResult, err, ok } from "@/lib/errors";
import { RESTAURANT_MEDIA_BUCKET } from "@/lib/supabase/media-url";
import type { Database } from "@/types/database.types";

type Supabase = SupabaseClient<Database>;

const CACHE_CONTROL_ONE_YEAR = "31536000";

export interface MediaFileInput {
  readonly restaurantId: string;
  readonly kind: ImageKind;
  readonly bytes: Uint8Array;
  readonly type: DetectedImageType;
}

/**
 * Uploads a file under a fresh path `<restaurant_id>/<kind>-<uuid>.<ext>`: a new path per
 * upload means no cache ever serves a stale image. The caller links it to its row.
 */
export async function storeMediaFile(
  supabase: Supabase,
  input: MediaFileInput,
): Promise<ActionResult<{ readonly path: string }>> {
  const extension = IMAGE_EXTENSIONS[input.type];
  const path = buildMediaPath(input.restaurantId, input.kind, randomUUID(), extension);
  const stored = await supabase.storage
    .from(RESTAURANT_MEDIA_BUCKET)
    .upload(path, input.bytes, {
      contentType: input.type,
      cacheControl: CACHE_CONTROL_ONE_YEAR,
      upsert: false,
    });
  return stored.error ? err("INTERNAL_ERROR") : ok({ path });
}

/**
 * Best effort: an orphan file is harmless, so a failed removal is only logged. Only files
 * directly in the restaurant's own folder are ever removed.
 */
export async function removeMediaFile(
  supabase: Supabase,
  restaurantId: string,
  path: string | null,
): Promise<void> {
  if (!path || !isOwnMediaPath(path, restaurantId)) {
    return;
  }
  const removal = await supabase.storage.from(RESTAURANT_MEDIA_BUCKET).remove([path]);
  if (removal.error) {
    console.error("Media file not removed", removal.error.message);
  }
}
