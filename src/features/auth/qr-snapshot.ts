import type { StoredQr } from "@/features/auth/identity-storage";

/**
 * Reads the drawn QR back from the `qrcode.react` SVG it rendered (background path first,
 * dark modules path last) so the offline page can redraw it without a QR library.
 */
export function readQrSnapshot(container: ParentNode): StoredQr | null {
  const svg = container.querySelector("svg");
  const viewBox = svg?.getAttribute("viewBox");
  const path = svg?.querySelector("path:last-of-type")?.getAttribute("d");
  if (!viewBox || !path) {
    return null;
  }
  return { viewBox, path };
}
