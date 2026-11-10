import { expect, type Page } from "@playwright/test";
import { openWithoutIntro, signedInTest as test } from "./signed-in";

/** Minimum size of a touch target (.cursorrules §10). */
const MIN_TARGET_PX = 48;
/** How far outside its 36 px disc the logo button must still answer a tap. */
const HIT_AREA_MARGIN_PX = 5;

interface SmallTarget {
  readonly label: string;
  readonly width: number;
  readonly height: number;
}

/** Visible links, buttons and fields smaller than the minimum (visually hidden inputs excluded). */
function findSmallTargets(page: Page): Promise<SmallTarget[]> {
  return page.evaluate((min) => {
    const nodes = document.querySelectorAll("a, button, select, input:not([type=file])");
    return [...nodes].flatMap((node) => {
      const box = node.getBoundingClientRect();
      const isRendered = box.width > 1 && box.height > 1;
      const hasHitArea = getComputedStyle(node, "::after").position === "absolute";
      if (!isRendered || hasHitArea || (box.width >= min && box.height >= min)) {
        return [];
      }
      const label = node.textContent?.trim() || node.getAttribute("aria-label") || "";
      return [{ label, width: Math.round(box.width), height: Math.round(box.height) }];
    });
  }, MIN_TARGET_PX);
}

for (const path of [
  "/",
  "/pro",
  "/pro/logs",
  "/pro/settings",
  "/onboarding",
  "/invitation",
]) {
  test(`touch targets: every control of ${path} is at least 48 px`, async ({ page }) => {
    await openWithoutIntro(page, path);

    expect(await findSmallTargets(page)).toEqual([]);
  });
}

test("touch targets: the logo button answers outside its 36 px disc", async ({
  page,
}) => {
  await page.goto("/pro/settings", { waitUntil: "networkidle" });
  const button = page.getByRole("button", { name: "Changer le logo", exact: true });
  test.skip((await button.count()) === 0, "the signed-in account is not an owner");

  const box = await button.boundingBox();
  const isHit = await page.evaluate(
    ([x, y]) =>
      document
        .elementFromPoint(x ?? 0, y ?? 0)
        ?.closest("button")
        ?.textContent?.trim(),
    [(box?.x ?? 0) - HIT_AREA_MARGIN_PX, (box?.y ?? 0) + (box?.height ?? 0) / 2],
  );
  expect(isHit).toBe("Changer le logo");
});
