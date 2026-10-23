import { SLUG_FALLBACK, SLUG_MAX_LENGTH } from "@/features/admin/constants";

/**
 * URL-safe identifier of a restaurant name: lower case, accents removed, anything that is
 * not a letter or digit becomes a single hyphen. Matches `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
 */
export function slugify(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, "");
  return slug.length > 0 ? slug : SLUG_FALLBACK;
}

/** The `attempt`-th candidate for a base slug: the base itself, then `base-2`, `base-3`, … */
export function slugCandidate(base: string, attempt: number): string {
  return attempt === 0 ? base : `${base}-${attempt + 1}`;
}
