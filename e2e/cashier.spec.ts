import { expect } from "@playwright/test";
import { signedInTest as test } from "./signed-in";

/** Height of the viewfinder (05b-ECRANS-SPEC §6). */
const VIEWFINDER_HEIGHT_PX = 270;

test.use({ permissions: ["camera"] });

test("cashier: the camera placeholder has the box of the viewfinder, nothing jumps", async ({
  page,
}) => {
  await page.goto("/pro", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Scanner un client" }).click();

  // While the camera module loads.
  const placeholder = page.locator('[data-slot="skeleton"]').first();
  await expect(placeholder).toBeVisible();
  const pendingBox = await placeholder.boundingBox();
  expect(pendingBox?.height).toBe(VIEWFINDER_HEIGHT_PX);

  // Camera running: same top, same height.
  const video = page.locator("video");
  await expect(video).toBeVisible();
  const viewfinder = await page
    .locator("div:has(> div > video), div:has(> video)")
    .first();
  const liveBox = await viewfinder.boundingBox();
  expect(liveBox?.height).toBe(VIEWFINDER_HEIGHT_PX);
  expect(liveBox?.y).toBe(pendingBox?.y);
});

test("cashier: no decorative animation once the camera runs", async ({ page }) => {
  await page.goto("/pro", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Scanner un client" }).click();
  await expect(page.locator("video")).toBeVisible();
  await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0);

  const running = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((animation) => animation.playState === "running")
      .map((animation) =>
        animation instanceof CSSAnimation ? animation.animationName : "transition",
      ),
  );
  expect(running).toEqual([]);
});
