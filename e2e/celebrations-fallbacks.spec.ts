import { expect, test } from "@playwright/test";
import {
  openPreview,
  readPainted,
  SCAN_REVEAL_MS,
  SCAN_REVEAL_REDUCED_MS,
  scanCard,
  TOLERANCE_MS,
} from "./da-preview";

/** Reduced-motion fallback of the scan reveal, and the segment grid (06-DA-ITERATION-2 §6). */
test("reduced motion: the card fades in, nothing rolls or flies, and it leaves sooner", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPreview(page);
  const startedAt = Date.now();
  await page.getByRole("button", { name: "+1 passage" }).click();
  const card = scanCard(page);

  await page.waitForTimeout(400);
  expect(await readPainted(card)).toMatchObject({ opacity: 1, scale: 1 });
  expect((await readPainted(card.locator("xpath=.."))).opacity).toBe(1);
  await expect(card.locator(".animate-roll-in, .animate-roll-out")).toHaveCount(0);
  await expect(page.locator(".animate-piece-burst")).toHaveCount(0);
  await expect(card.getByRole("img", { name: "6 / 10 passages" })).toBeVisible();

  await expect(card).toHaveCount(0, { timeout: SCAN_REVEAL_REDUCED_MS + TOLERANCE_MS });
  expect(Date.now() - startedAt).toBeLessThan(SCAN_REVEAL_MS);
});

test("segments: an incomplete second row keeps the width of the first one", async ({
  page,
}) => {
  await openPreview(page);
  const widths = await page
    .getByRole("img", { name: "13 / 15 passages" })
    .evaluate((grid) =>
      [...grid.children].map((segment) => ({
        width: Math.round(segment.getBoundingClientRect().width),
        top: Math.round(segment.getBoundingClientRect().top),
      })),
    );

  expect(widths).toHaveLength(15);
  expect(new Set(widths.map((segment) => segment.width)).size).toBe(1);
  expect(new Set(widths.map((segment) => segment.top)).size).toBe(2);
});
