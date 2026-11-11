import { expect, test } from "@playwright/test";
import {
  openPreview,
  readPainted,
  SCAN_REVEAL_MS,
  scanCard,
  TOLERANCE_MS,
} from "./da-preview";

/**
 * Celebrations of 06-DA-ITERATION-2, measured on made-up cards (/login/da-preview, enabled
 * by DA_PREVIEW=1 on the e2e server). Each test samples computed values while the animation
 * runs: an animation can "pass" and still be invisible (opacity stuck at 0, transform not
 * played), so what is painted is read, not the React state.
 */
test("scan reveal: the card comes in, the counter rolls, then it leaves by itself", async ({
  page,
}) => {
  await openPreview(page);
  await page.getByRole("button", { name: "+1 passage" }).click();
  const card = scanCard(page);
  const veil = card.locator("xpath=..");
  const newNumber = card.locator(".animate-roll-in");

  // Just after the start: on its way in, the new number still hidden below.
  await expect(card).toBeAttached();
  const early = await readPainted(card);
  expect(early.scale).toBeLessThan(1);
  expect((await readPainted(newNumber)).opacity).toBe(0);
  await expect(veil).toHaveCSS("pointer-events", "none");

  // Settled: veil and card opaque, counter rolled to 6, a sixth segment filled.
  await page.waitForTimeout(1700);
  expect((await readPainted(veil)).opacity).toBe(1);
  expect(await readPainted(card)).toMatchObject({ opacity: 1, scale: 1 });
  expect(await readPainted(newNumber)).toMatchObject({ opacity: 1, offsetY: 0 });
  await expect(newNumber).toHaveText("6");
  await expect(card.getByRole("img", { name: "6 / 10 passages" })).toBeVisible();

  await expect(card).toHaveCount(0, { timeout: SCAN_REVEAL_MS + TOLERANCE_MS });
});

test("scan reveal: a touch closes it at once", async ({ page }) => {
  await openPreview(page);
  await page.getByRole("button", { name: "+1 passage" }).click();
  await expect(scanCard(page)).toBeAttached();

  await page.mouse.click(5, 5);

  await expect(scanCard(page)).toHaveCount(0, { timeout: TOLERANCE_MS });
});

test("reward: the scan reveal plays first, then the medal stays until closed", async ({
  page,
}) => {
  await openPreview(page);
  await page.getByRole("button", { name: "Aller à 9" }).click();
  await expect(scanCard(page)).toHaveCount(0, { timeout: SCAN_REVEAL_MS + TOLERANCE_MS });
  await page.getByRole("button", { name: "+1 passage" }).click();

  const medal = page.getByRole("dialog", { name: "Récompense disponible" });
  await expect(scanCard(page)).toBeAttached();
  await expect(medal).toHaveCount(0);
  await expect(medal).toBeVisible({ timeout: SCAN_REVEAL_MS + TOLERANCE_MS });

  // The coin starts small, the title is still hidden; both are in place once it has spun.
  const coin = medal.locator(".animate-spin-coin");
  const title = medal.getByRole("heading", { name: "Récompense disponible" });
  expect((await readPainted(coin)).scale).toBeLessThan(1);
  expect((await readPainted(title)).opacity).toBe(0);
  await page.waitForTimeout(2700);
  expect(await readPainted(coin)).toMatchObject({ opacity: 1, scale: 1 });
  expect((await readPainted(title)).opacity).toBe(1);
  await expect(medal.getByText("menu offert chez NouilleAtomique")).toBeVisible();
  await expect(medal.getByRole("button", { name: "Le montrer en caisse" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(medal).toHaveCount(0);
});

test("reward: the medal is shown once per reward", async ({ page }) => {
  await openPreview(page);
  await page.getByRole("button", { name: "Aller à 9" }).click();
  await page.getByRole("button", { name: "+1 passage" }).click();
  const medal = page.getByRole("dialog", { name: "Récompense disponible" });
  await expect(medal).toBeVisible({ timeout: 2 * SCAN_REVEAL_MS + TOLERANCE_MS });
  await medal.getByRole("button", { name: "Plus tard" }).click();
  await expect(medal).toHaveCount(0);

  // Cancelled then credited again: the stamp is celebrated, the same reward is not.
  await page.getByRole("button", { name: "Annuler un passage" }).click();
  await page.getByRole("button", { name: "+1 passage" }).click();
  await expect(scanCard(page)).toBeAttached();
  await expect(scanCard(page)).toHaveCount(0, { timeout: SCAN_REVEAL_MS + TOLERANCE_MS });
  await expect(medal).toHaveCount(0);
});
