/** An owner invitation stays valid this long (`restaurant_invitations.expires_at`). */
export const INVITATION_VALIDITY_DAYS = 14;
export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/** Must fit the `restaurants.slug` format; leaves room for a `-N` suffix. */
export const SLUG_MAX_LENGTH = 60;
export const SLUG_FALLBACK = "restaurant";
/** Attempts to find a free slug (`name`, `name-2`, … ) before giving up. */
export const SLUG_MAX_ATTEMPTS = 5;
/** PostgreSQL `unique_violation`. */
export const UNIQUE_VIOLATION_CODE = "23505";

/**
 * Printable easel (A6 portrait at 300 dpi) carrying the restaurant QR. Sizes are in
 * pixels of the exported PNG.
 */
export const EASEL = {
  width: 1240,
  height: 1748,
  qrSize: 860,
  margin: 90,
  accent: "#059669",
  titleMaxPx: 110,
  titleMinPx: 56,
  captionPx: 64,
  footerPx: 40,
} as const;

export const EASEL_CAPTION = "Scannez pour cumuler vos passages";
export const EASEL_FOOTER =
  "Carte de fidélité Fidly · gratuite et sans appli à installer";
