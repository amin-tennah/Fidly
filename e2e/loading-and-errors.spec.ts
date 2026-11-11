import { expect, type Locator, type Page } from "@playwright/test";
import { signedInTest as test } from "./signed-in";

/** Added network latency, long enough to observe the loading skeleton. */
const SLOW_NETWORK_LATENCY_MS = 700;
const POSITION_TOLERANCE_PX = 2;

/** Slows every request down from now on (Chromium only), like a poor connection at the till. */
async function slowDown(page: Page): Promise<void> {
  const session = await page.context().newCDPSession(page);
  await session.send("Network.enable");
  await session.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: SLOW_NETWORK_LATENCY_MS,
    downloadThroughput: -1,
    uploadThroughput: -1,
  });
}

async function topOf(locator: Locator): Promise<number> {
  const box = await locator.boundingBox();
  return box?.y ?? Number.NaN;
}

test("404: a card the customer does not have shows the branded French screen", async ({
  page,
}) => {
  await page.goto("/cartes/does-not-exist");

  await expect(
    page.getByRole("heading", { name: "Cette page n'existe pas" }),
  ).toBeVisible();
  await expect(page.getByText("This page could not be found")).toHaveCount(0);
  const home = page.getByRole("link", { name: "Retour à mes cartes" });
  await expect(home).toHaveCSS("min-height", "56px");
  await home.click();
  await expect(page).toHaveURL(/\/$/);
});

test("pro tabs: the logs skeleton keeps the header, the tab bar and the heading in place", async ({
  page,
}) => {
  await page.goto("/pro", { waitUntil: "networkidle" });
  await slowDown(page);
  const restaurantTop = await topOf(page.getByRole("heading", { level: 1 }).first());

  await page.getByRole("link", { name: "Logs" }).click();

  // While the server answers: skeleton shown inside the layout, nothing has moved.
  const pending = page.locator('[aria-busy="true"]');
  await expect(pending).toBeVisible();
  const heading = page.getByRole("heading", { name: "Journal des scans" });
  const pendingHeadingTop = await topOf(heading);
  expect(await topOf(page.getByRole("heading", { level: 1 }).first())).toBeCloseTo(
    restaurantTop,
    0,
  );
  await expect(page.getByRole("link", { name: "Logs" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  // Once loaded: the heading has not jumped.
  await expect(pending).toHaveCount(0);
  const loadedHeadingTop = await topOf(heading);
  expect(Math.abs(loadedHeadingTop - pendingHeadingTop)).toBeLessThanOrEqual(
    POSITION_TOLERANCE_PX,
  );
});

test("pro tabs: the scanner skeleton has the shape of the scan action", async ({
  page,
}) => {
  await page.goto("/pro/stats", { waitUntil: "networkidle" });
  await slowDown(page);

  await page.getByRole("link", { name: "Scanner" }).click();

  const pending = page.locator('[aria-busy="true"]');
  await expect(pending).toBeVisible();
  const placeholder = await pending
    .locator('[data-slot="skeleton"]')
    .first()
    .boundingBox();

  const action = page.getByRole("button", { name: "Scanner un client" });
  await expect(action).toBeVisible();
  const real = await action.boundingBox();
  expect(Math.abs((real?.y ?? 0) - (placeholder?.y ?? -1))).toBeLessThanOrEqual(
    POSITION_TOLERANCE_PX,
  );
  expect(Math.abs((real?.height ?? 0) - (placeholder?.height ?? -1))).toBeLessThanOrEqual(
    POSITION_TOLERANCE_PX,
  );
});
