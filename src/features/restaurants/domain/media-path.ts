import type { IMAGE_KINDS } from "@/features/restaurants/constants";

export type ImageKind = (typeof IMAGE_KINDS)[number];

/** Storage path `<restaurant_id>/<kind>-<id>.<ext>`: the folder is what the policies check. */
export function buildMediaPath(
  restaurantId: string,
  kind: ImageKind,
  fileId: string,
  extension: string,
): string {
  return `${restaurantId}/${kind}-${fileId}.${extension}`;
}

/** True when `path` sits directly in the restaurant's own folder (no traversal). */
export function isOwnMediaPath(path: string, restaurantId: string): boolean {
  const prefix = `${restaurantId}/`;
  const name = path.slice(prefix.length);
  return (
    path.startsWith(prefix) &&
    name.length > 0 &&
    !name.includes("/") &&
    !name.includes("..")
  );
}
