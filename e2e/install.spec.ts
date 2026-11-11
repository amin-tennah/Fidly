import { expect, test, type Locator, type Page } from "@playwright/test";
import { PREVIEW_PATH } from "./da-preview";

/**
 * Install banner and "installed" celebration (06-DA-ITERATION-2 §4 and §5) on the preview
 * page. The browser events are simulated: a real installation cannot be driven from a test.
 */

/** Hands the page an install prompt, as Android Chrome does. */
function offerInstallPrompt(page: Page): Promise<void> {
  return page.evaluate(() => {
    const event = Object.assign(new Event("beforeinstallprompt"), {
      prompt: () => Promise.resolve(),
      userChoice: Promise.resolve({ outcome: "accepted" }),
    });
    window.dispatchEvent(event);
  });
}

function reportInstalled(page: Page): Promise<void> {
  return page.evaluate(() => {
    window.dispatchEvent(new Event("appinstalled"));
  });
}

function readOffsetY(locator: Locator): Promise<number> {
  return locator.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m42);
}

function readOpacity(locator: Locator): Promise<number> {
  return locator.evaluate((node) => Number(getComputedStyle(node).opacity));
}

test("install banner: says what the app gives, with three benefits of equal width", async ({
  page,
}) => {
  await page.goto(PREVIEW_PATH, { waitUntil: "networkidle" });
  const banner = page.getByRole("region", { name: "Ajoute Rézone à tes applis" });
  await expect(banner).toHaveCount(0);

  await offerInstallPrompt(page);

  await expect(banner).toBeVisible();
  await expect(banner.getByRole("button", { name: "Installer" })).toBeVisible();
  await expect(banner.getByRole("button", { name: "Plus tard" })).toBeVisible();
  const benefits = banner.getByRole("listitem");
  await expect(benefits).toHaveText(["Ton QR", "Tes cartes", "Les commerces"]);
  const widths = await benefits.evaluateAll((items) =>
    items.map((item) => Math.round(item.getBoundingClientRect().width)),
  );
  expect(new Set(widths).size).toBe(1);
});

test("install: accepting the prompt alone celebrates nothing", async ({ page }) => {
  await page.goto(PREVIEW_PATH, { waitUntil: "networkidle" });
  await offerInstallPrompt(page);

  await page.getByRole("button", { name: "Installer" }).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("installed: the icon drops into its slot, then the text and the button arrive", async ({
  page,
}) => {
  await page.goto(PREVIEW_PATH, { waitUntil: "networkidle" });
  await offerInstallPrompt(page);
  const banner = page.getByRole("region", { name: "Ajoute Rézone à tes applis" });
  await expect(banner).toBeVisible();

  await reportInstalled(page);

  const dialog = page.getByRole("dialog", { name: "Rézone est sur ton écran d'accueil" });
  await expect(dialog).toBeVisible();
  await expect(banner).toHaveCount(0);
  const icon = dialog.locator(".animate-icon-drop");
  const button = dialog.getByRole("button", { name: "Compris" });

  // Before the drop: the icon waits above its slot, the button is not there yet.
  expect(await readOffsetY(icon)).toBeLessThan(-100);
  expect(await readOpacity(button)).toBe(0);

  await page.waitForTimeout(3200);
  expect(await readOffsetY(icon)).toBe(0);
  expect(await readOpacity(icon)).toBe(1);
  expect(await readOpacity(button)).toBe(1);
  await expect(dialog.getByRole("listitem")).toHaveCount(3);

  // Acknowledged once: a later report does not bring it back.
  await button.click();
  await expect(dialog).toHaveCount(0);
  await reportInstalled(page);
  await expect(dialog).toHaveCount(0);
});

test("installed, reduced motion: the icon is already in place", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(PREVIEW_PATH, { waitUntil: "networkidle" });

  await reportInstalled(page);

  const dialog = page.getByRole("dialog", { name: "Rézone est sur ton écran d'accueil" });
  await expect(dialog.getByRole("button", { name: "Compris" })).toBeVisible();
  await expect(dialog.locator(".animate-icon-drop, .animate-spark")).toHaveCount(0);
  await page.waitForTimeout(400);
  expect(await readOpacity(dialog)).toBe(1);
});
