import {
  INVITATION_VALIDITY_DAYS,
  MILLISECONDS_PER_DAY,
} from "@/features/admin/constants";

/** Address encoded in the easel QR: the client home, carrying the restaurant `ref` (Phase 10). */
export function buildEaselUrl(appUrl: string, slug: string): string {
  const root = appUrl.replace(/\/+$/, "");
  return `${root}/?ref=${encodeURIComponent(slug)}`;
}

export function easelFileName(slug: string): string {
  return `chevalet-${slug}.png`;
}

/**
 * Largest font size (from `maxPx` down to `minPx`) at which the text fits `maxWidth`.
 * `measure` returns the text width at a given size, so the rule stays testable.
 */
export function fitFontSize(
  measure: (fontPx: number) => number,
  maxWidth: number,
  maxPx: number,
  minPx: number,
): number {
  for (let size = maxPx; size > minPx; size -= 2) {
    if (measure(size) <= maxWidth) {
      return size;
    }
  }
  return minPx;
}

/** When an invitation issued at `now` stops being valid. */
export function invitationExpiry(now: Date): Date {
  return new Date(now.getTime() + INVITATION_VALIDITY_DAYS * MILLISECONDS_PER_DAY);
}
