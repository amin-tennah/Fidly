import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Shared by the celebration specs: the preview page (/login/da-preview, enabled by
 * DA_PREVIEW=1 on the e2e server) and a reader of what is really painted.
 */
export const PREVIEW_PATH = "/login/da-preview";
/** Mirrors SCAN_REVEAL_DURATION_MS and SCAN_REVEAL_REDUCED_DURATION_MS (loyalty constants). */
export const SCAN_REVEAL_MS = 3400;
export const SCAN_REVEAL_REDUCED_MS = 2200;
export const TOLERANCE_MS = 600;

export interface Painted {
  readonly opacity: number;
  /** Scale and vertical offset of the computed transform (1 and 0 when there is none). */
  readonly scale: number;
  readonly offsetY: number;
}

export function readPainted(locator: Locator): Promise<Painted> {
  return locator.evaluate((node) => {
    const style = getComputedStyle(node);
    const matrix = new DOMMatrix(
      style.transform === "none" ? undefined : style.transform,
    );
    return {
      opacity: Number(style.opacity),
      scale: Math.hypot(matrix.a, matrix.b),
      offsetY: matrix.m42,
    };
  });
}

export async function openPreview(page: Page): Promise<void> {
  await page.goto(PREVIEW_PATH, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Mes cartes" })).toBeVisible();
}

export function scanCard(page: Page): Locator {
  return page.getByRole("status").filter({ hasText: "Palier 1" });
}
