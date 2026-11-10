import { expect, test, type Page } from "@playwright/test";

/** Home-indicator height of a recent iPhone, injected in place of `env(safe-area-inset-*)`. */
const FAKE_INSET_PX = 34;
const LOGIN_TOP_PADDING_PX = 56;
const LOGIN_BOTTOM_PADDING_PX = 28;
/** Below 16 px, iOS zooms the page when a field takes focus. */
const IOS_NO_ZOOM_FONT_SIZE_PX = 16;

interface ShellStyles {
  readonly overscroll: string;
  readonly touchAction: string;
  readonly tapHighlight: string;
  readonly headingSelect: string | null;
  readonly fieldSelect: string | null;
  readonly fieldFontSizePx: number;
}

function readShellStyles(page: Page): Promise<ShellStyles> {
  return page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const heading = document.querySelector("h1");
    const field = document.querySelector("input");
    return {
      overscroll: getComputedStyle(document.documentElement).overscrollBehaviorY,
      touchAction: body.touchAction,
      tapHighlight: body.getPropertyValue("-webkit-tap-highlight-color"),
      headingSelect: heading ? getComputedStyle(heading).userSelect : null,
      fieldSelect: field ? getComputedStyle(field).userSelect : null,
      fieldFontSizePx: field ? parseFloat(getComputedStyle(field).fontSize) : 0,
    };
  });
}

test("app shell: edge-to-edge viewport, Apple web-app tags and a stable manifest", async ({
  page,
  request,
}) => {
  await page.goto("/login");

  const viewport = page.locator('meta[name="viewport"]');
  await expect(viewport).toHaveAttribute("content", /viewport-fit=cover/);
  // Pinch zoom must stay available (accessibility): the scale is never locked.
  await expect(viewport).not.toHaveAttribute(
    "content",
    /user-scalable=no|maximum-scale=1/,
  );
  await expect(
    page.locator('meta[name="apple-mobile-web-app-status-bar-style"]'),
  ).toHaveAttribute("content", "default");

  const manifest: unknown = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest).toMatchObject({ id: "/", scope: "/", display: "standalone" });
});

test("app shell: no rubber band, tap flash, double-tap zoom or stray text selection", async ({
  page,
}) => {
  await page.goto("/login");
  const styles = await readShellStyles(page);

  expect(styles.overscroll).toBe("none");
  expect(styles.touchAction).toBe("manipulation");
  expect(styles.tapHighlight).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  expect(styles.headingSelect).toBe("none");
  expect(styles.fieldSelect).toBe("text");
  expect(styles.fieldFontSizePx).toBeGreaterThanOrEqual(IOS_NO_ZOOM_FONT_SIZE_PX);
});

test("app shell: device safe areas are added to the screen padding", async ({ page }) => {
  await page.goto("/login");
  const main = page.locator("main");

  await expect(main).toHaveCSS("padding-top", `${LOGIN_TOP_PADDING_PX}px`);
  await expect(main).toHaveCSS("padding-bottom", `${LOGIN_BOTTOM_PADDING_PX}px`);

  await page.addStyleTag({
    content: `:root { --safe-top: ${FAKE_INSET_PX}px; --safe-bottom: ${FAKE_INSET_PX}px; }`,
  });

  await expect(main).toHaveCSS(
    "padding-top",
    `${LOGIN_TOP_PADDING_PX + FAKE_INSET_PX}px`,
  );
  await expect(main).toHaveCSS(
    "padding-bottom",
    `${LOGIN_BOTTOM_PADDING_PX + FAKE_INSET_PX}px`,
  );
});
