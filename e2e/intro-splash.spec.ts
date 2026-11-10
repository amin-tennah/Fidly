import { expect, type Locator } from "@playwright/test";
import { signedInTest as test } from "./signed-in";

/** Mirrors INTRO_MIN_DURATION_MS / INTRO_MAX_DURATION_MS (features/loyalty/constants.ts). */
const INTRO_MIN_MS = 1900;
const INTRO_MAX_MS = 4000;
const SLIDE_OUT_MS = 500;
const TOLERANCE_MS = 400;
/** First paint and animation start are one or two frames apart. */
const PAINT_TOLERANCE_MS = 50;

interface IntroFrame {
  readonly layerOpacity: number;
  readonly firstLetterClip: string;
  readonly stampOpacity: number;
  readonly elapsedMs: number;
}

/** Computed values of the intro layer: what is painted, and since when it animates. */
function readIntro(intro: Locator): Promise<IntroFrame> {
  return intro.evaluate((layer) => {
    const letter = layer.querySelector("svg.animate-write");
    const stamp = layer.querySelector("svg.animate-thump");
    // The intro is in the server HTML: it starts animating at first contentful paint.
    const [firstPaint] = performance.getEntriesByName("first-contentful-paint");
    return {
      layerOpacity: Number(getComputedStyle(layer).opacity),
      firstLetterClip: letter ? getComputedStyle(letter).clipPath : "",
      stampOpacity: stamp ? Number(getComputedStyle(stamp).opacity) : 0,
      elapsedMs: performance.now() - (firstPaint?.startTime ?? 0),
    };
  });
}

test("intro: covers the home while it loads, writes the logo, then slides away", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "commit" });
  const intro = page.getByRole("status", { name: "Bienvenue sur Rézone" });
  await expect(intro).toBeVisible();

  // The first letter is still hidden by its sweep, the stamp has not landed.
  const early = await readIntro(intro);
  expect(early.layerOpacity).toBe(1);
  expect(early.stampOpacity).toBeLessThan(1);

  // Once the sequence has played: letter fully revealed, stamp opaque, intro still there.
  await page.waitForTimeout(Math.max(0, 1500 - early.elapsedMs));
  const late = await readIntro(intro);
  expect(late.firstLetterClip).toContain("-12%");
  expect(late.stampOpacity).toBe(1);
  expect(late.elapsedMs).toBeLessThan(INTRO_MIN_MS);

  // It leaves after the minimum (the home is ready by then) and well before the ceiling.
  await expect(intro).toHaveClass(/animate-slide-out/, { timeout: INTRO_MAX_MS });
  const leaving = await readIntro(intro);
  expect(leaving.elapsedMs).toBeGreaterThanOrEqual(INTRO_MIN_MS - PAINT_TOLERANCE_MS);
  expect(leaving.elapsedMs).toBeLessThan(INTRO_MIN_MS + SLIDE_OUT_MS + TOLERANCE_MS);
  await expect(intro).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("intro: the skip button dismisses it at once", async ({ page }) => {
  await page.goto("/");
  const intro = page.getByRole("status", { name: "Bienvenue sur Rézone" });

  await page.getByRole("button", { name: "Passer" }).click();

  await expect(intro).toHaveClass(/animate-slide-out/);
  await expect(intro).toHaveCount(0, { timeout: SLIDE_OUT_MS + TOLERANCE_MS });
});

test("intro: is not replayed when coming back to the home", async ({ page }) => {
  await page.goto("/");
  const intro = page.getByRole("status", { name: "Bienvenue sur Rézone" });
  await page.getByRole("button", { name: "Passer" }).click();
  await expect(intro).toHaveCount(0);

  await page.locator('a[href^="/cartes/"]').first().click();
  await expect(page).toHaveURL(/\/cartes\//);
  await page.locator('main a[href="/"]').first().click();
  await expect(page).toHaveURL(/\/$/);

  await expect(intro).toHaveCount(0);
});

test("intro: with reduced motion it only covers the loading", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByRole("status", { name: "Bienvenue sur Rézone" })).toHaveCount(
    0,
    {
      timeout: INTRO_MIN_MS,
    },
  );
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
