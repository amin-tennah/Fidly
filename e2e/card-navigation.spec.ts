import { expect, type Page } from "@playwright/test";
import {
  openWithoutIntro,
  readMidSlide,
  readSlide,
  signedInTest as test,
} from "./signed-in";

const VIEWPORT_WIDTH_PX = 375;
/** The receding screen stops at -28 % of the viewport (05-DIRECTION-ARTISTIQUE §5.4). */
const RECEDE_END_PX = -Math.round(VIEWPORT_WIDTH_PX * 0.28);
const MID_SLIDE_MS = 150;
const AFTER_SLIDE_MS = 700;

function openHomeWithoutIntro(page: Page): Promise<void> {
  return openWithoutIntro(page, "/");
}

async function openFirstCard(page: Page): Promise<void> {
  await page.locator('a[href^="/cartes/"]').first().click();
  await expect(page).toHaveURL(/\/cartes\//);
}

test("card: the screen slides in from the right while the home recedes", async ({
  page,
}) => {
  await openHomeWithoutIntro(page);
  await openFirstCard(page);

  const mid = await readMidSlide(page, ["recede", "slide-in"]);
  expect(mid.incomingX).toBeGreaterThan(0);
  expect(mid.incomingX).toBeLessThan(VIEWPORT_WIDTH_PX);
  expect(mid.outgoingX).toBeLessThan(0);
  expect(mid.outgoingX).toBeGreaterThanOrEqual(RECEDE_END_PX);

  await page.waitForTimeout(AFTER_SLIDE_MS);
  const end = await readSlide(page);
  expect(end.names).toEqual([]);
  // The slide never widens the page (it used to grow to twice the viewport).
  expect(end.pageWidth).toBe(VIEWPORT_WIDTH_PX);
});

test("card: the phone back button plays the slide in reverse", async ({ page }) => {
  await openHomeWithoutIntro(page);
  await openFirstCard(page);
  await page.waitForTimeout(AFTER_SLIDE_MS);

  await page.evaluate(() => window.history.back());
  const mid = await readMidSlide(page, ["slide-away", "return"]);

  expect(mid.outgoingX).toBeGreaterThan(0);
  expect(mid.incomingX).toBeLessThan(0);
  await expect(page).toHaveURL(/\/$/);
});

test("card: the in-app back link slides back and leaves no card in the history", async ({
  page,
}) => {
  await openHomeWithoutIntro(page);
  const lengthOnHome = await page.evaluate(() => window.history.length);
  await openFirstCard(page);
  await page.waitForTimeout(AFTER_SLIDE_MS);

  await page.locator('main a[href="/"]').first().click();
  const mid = await readMidSlide(page, ["slide-away", "return"]);
  expect(mid.outgoingX).toBeGreaterThan(0);

  await expect(page).toHaveURL(/\/$/);
  // Popped, not pushed: one forward entry at most, and "back" does not return to the card.
  expect(await page.evaluate(() => window.history.length)).toBe(lengthOnHome + 1);
  await page.waitForTimeout(AFTER_SLIDE_MS);
  await page.goBack();
  await expect(page).not.toHaveURL(/\/cartes\//);
});

test("card: with reduced motion the screens swap without sliding", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // With reduced motion the intro leaves by itself as soon as the home is there.
  await expect(page.getByRole("status", { name: "Bienvenue sur Rézone" })).toHaveCount(0);
  await openFirstCard(page);

  await page.waitForTimeout(MID_SLIDE_MS);
  expect((await readSlide(page)).names).toEqual([]);
  await expect(page.getByRole("region", { name: /^Ta carte/ })).toBeVisible();
});
