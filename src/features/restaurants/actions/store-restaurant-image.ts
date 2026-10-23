import "server-only";
import { randomUUID } from "node:crypto";
import type { ServerSupabase } from "@/features/restaurants/actions/owner-guard";
import type { ParsedImageUpload } from "@/features/restaurants/actions/parse-image-upload";
import { IMAGE_EXTENSIONS } from "@/features/restaurants/domain/detect-image-type";
import { buildMediaPath, isOwnMediaPath } from "@/features/restaurants/domain/media-path";
import { type ActionResult, err, ok } from "@/lib/errors";
import { RESTAURANT_MEDIA_BUCKET } from "@/lib/supabase/media-url";

const CACHE_CONTROL_ONE_YEAR = "31536000";

/** Best effort: an orphan file is harmless, so a failed removal is only logged. */
async function removePreviousImage(
  supabase: ServerSupabase,
  restaurantId: string,
  previous: string | null,
): Promise<void> {
  if (!previous || !isOwnMediaPath(previous, restaurantId)) {
    return;
  }
  const removal = await supabase.storage.from(RESTAURANT_MEDIA_BUCKET).remove([previous]);
  if (removal.error) {
    console.error("Previous restaurant image not removed", removal.error.message);
  }
}

/**
 * Uploads the image under a fresh path, points the restaurant to it, then removes the
 * previous file. A failed column update rolls the new file back.
 */
export async function storeRestaurantImage(
  supabase: ServerSupabase,
  upload: ParsedImageUpload,
): Promise<ActionResult<null>> {
  const { restaurantId, kind, bytes, type } = upload;
  const column = kind === "logo" ? "logo_path" : "cover_path";
  const { data: current, error: readError } = await supabase
    .from("restaurants")
    .select("logo_path, cover_path")
    .eq("id", restaurantId)
    .maybeSingle();
  if (readError || !current) {
    return err("INTERNAL_ERROR");
  }

  const path = buildMediaPath(restaurantId, kind, randomUUID(), IMAGE_EXTENSIONS[type]);
  const storage = supabase.storage.from(RESTAURANT_MEDIA_BUCKET);
  const stored = await storage.upload(path, bytes, {
    contentType: type,
    cacheControl: CACHE_CONTROL_ONE_YEAR,
    upsert: false,
  });
  if (stored.error) {
    return err("INTERNAL_ERROR");
  }

  const patch = kind === "logo" ? { logo_path: path } : { cover_path: path };
  const { error: updateError } = await supabase
    .from("restaurants")
    .update(patch)
    .eq("id", restaurantId);
  if (updateError) {
    await storage.remove([path]);
    return err("INTERNAL_ERROR");
  }

  await removePreviousImage(supabase, restaurantId, current[column]);
  return ok(null);
}
