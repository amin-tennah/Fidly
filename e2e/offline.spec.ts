import { expect, test, type Page } from "@playwright/test";

const IDENTITY_KEY = "rezone.identity.v1";
const QR_KEY = "rezone.identity-qr.v1";
const SHORT_CODE = "7DNWSA";

test("service worker files are public, and sw.js is never cached by the browser", async ({
  request,
}) => {
  const worker = await request.get("/sw.js?v=test", { maxRedirects: 0 });
  expect(worker.status()).toBe(200);
  expect(worker.headers()["cache-control"]).toContain("no-store");
  expect(worker.headers()["content-type"]).toContain("javascript");

  const offline = await request.get("/offline.html", { maxRedirects: 0 });
  expect(offline.status()).toBe(200);
});

/** What the device holds, as the offline page expects it. */
async function seedStoredIdentity(page: Page): Promise<void> {
  await page.addInitScript(
    ({ identityKey, qrKey, code }) => {
      window.localStorage.setItem(
        identityKey,
        JSON.stringify({
          userId: "u",
          displayName: "Test",
          qrToken: "T",
          shortCode: code,
        }),
      );
      window.localStorage.setItem(
        qrKey,
        JSON.stringify({ viewBox: "0 0 29 29", path: "M4 4h7v7H4z" }),
      );
    },
    { identityKey: IDENTITY_KEY, qrKey: QR_KEY, code: SHORT_CODE },
  );
}

/** A cache left by a previous build, planted before the worker exists: activation must purge it. */
async function plantStaleCache(page: Page): Promise<void> {
  await page.addInitScript(async () => {
    if ((await caches.keys()).length === 0) {
      await caches.open("rezone-previous-build");
    }
  });
}

async function readCaches(page: Page): Promise<{ names: string[]; urls: string[] }> {
  return page.evaluate(async () => {
    const names = await caches.keys();
    const requests = await Promise.all(
      names.map(async (name) =>
        (await (await caches.open(name)).keys()).map((r) => r.url),
      ),
    );
    return { names, urls: requests.flat() };
  });
}

test("offline: the worker caches only the offline page and redisplays the stored QR", async ({
  page,
  context,
}) => {
  await seedStoredIdentity(page);
  await plantStaleCache(page);

  await page.goto("/login");
  await page.evaluate(() => navigator.serviceWorker.ready);
  // `/login` was loaded before the worker took control: reload so it controls this page.
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);

  const cached = await readCaches(page);
  expect(cached.names).toHaveLength(1);
  expect(cached.names[0]).toMatch(/^rezone-.+/);
  expect(cached.names).not.toContain("rezone-previous-build");
  expect(cached.urls.some((url) => url.endsWith("/offline.html"))).toBe(true);
  // Hashed build files only, never a page or a data payload.
  const others = cached.urls.filter((url) => !url.endsWith("/offline.html"));
  expect(others.every((url) => new URL(url).pathname.startsWith("/_next/static/"))).toBe(
    true,
  );

  await context.setOffline(true);
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Tu es hors ligne" })).toBeVisible();
  await expect(page.getByRole("img", { name: /QR code personnel/ })).toBeVisible();
  await expect(page.getByText("7DN WSA")).toBeVisible();
  await expect(page.locator("#qr path")).toHaveAttribute("d", "M4 4h7v7H4z");
});

test("offline without a stored identity: asks for a first visit instead of showing a blank", async ({
  page,
  context,
}) => {
  await page.goto("/login");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.goto("/login");

  await expect(page.getByText(/après ta première visite avec du réseau/)).toBeVisible();
  await expect(page.locator("#card")).toBeHidden();
});

test("offline page: leaves by itself once the network really answers again", async ({
  page,
  context,
}) => {
  await page.goto("/login");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Tu es hors ligne" })).toBeVisible();

  await context.setOffline(false);

  await expect(page.getByRole("heading", { name: "Tu es hors ligne" })).toHaveCount(0, {
    timeout: 8000,
  });
  await expect(
    page.getByRole("button", { name: /Continuer|Recevoir/i }).first(),
  ).toBeVisible();
});
