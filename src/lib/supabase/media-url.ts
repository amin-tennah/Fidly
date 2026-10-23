import { getPublicEnv } from "@/lib/env";

export const RESTAURANT_MEDIA_BUCKET = "restaurant-media";

/** Builds the public URL of a file of the `restaurant-media` bucket (public read). */
export function buildPublicMediaUrl(baseUrl: string, path: string): string {
  const root = baseUrl.replace(/\/+$/, "");
  return `${root}/storage/v1/object/public/${RESTAURANT_MEDIA_BUCKET}/${path}`;
}

/** Public URL of a stored media path, or `null` when there is no file. */
export function getRestaurantMediaUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }
  return buildPublicMediaUrl(getPublicEnv().NEXT_PUBLIC_SUPABASE_URL, path);
}
