import "server-only";
import { removeMediaFile, storeMediaFile } from "@/features/media/server";
import type { ServerSupabase } from "@/features/restaurants/actions/owner-guard";
import type { ParsedImageUpload } from "@/features/restaurants/actions/parse-image-upload";
import { type ActionResult, err, ok } from "@/lib/errors";

/**
 * Uploads the image under a fresh path, points the restaurant to it, then removes the
 * previous file. A failed column update rolls the new file back.
 */
export async function storeRestaurantImage(
  supabase: ServerSupabase,
  upload: ParsedImageUpload,
): Promise<ActionResult<null>> {
  const { restaurantId, kind } = upload;
  const column = kind === "logo" ? "logo_path" : "cover_path";
  const { data: current, error: readError } = await supabase
    .from("restaurants")
    .select("logo_path, cover_path")
    .eq("id", restaurantId)
    .maybeSingle();
  if (readError || !current) {
    return err("INTERNAL_ERROR");
  }

  const stored = await storeMediaFile(supabase, upload);
  if (!stored.ok) {
    return stored;
  }
  const { path } = stored.data;
  const patch = kind === "logo" ? { logo_path: path } : { cover_path: path };
  const { error: updateError } = await supabase
    .from("restaurants")
    .update(patch)
    .eq("id", restaurantId);
  if (updateError) {
    await removeMediaFile(supabase, restaurantId, path);
    return err("INTERNAL_ERROR");
  }

  await removeMediaFile(supabase, restaurantId, current[column]);
  return ok(null);
}
