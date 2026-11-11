import { test as base, expect, type Page } from "@playwright/test";

/**
 * Signed-in journeys need a real session (login is by email code, DT-007). Save one with
 * Playwright (`context.storageState({ path })`) outside the repository, then run:
 *   E2E_SESSION=/absolute/path/session.json pnpm test:e2e
 * Without the variable these tests are skipped.
 *
 * The session is written back after each test: the auth server rotates the refresh token,
 * and a file left with a consumed token logs the account out (hence one worker, see
 * playwright.config.ts).
 */
const SESSION_FILE = process.env.E2E_SESSION;

export const signedInTest = base.extend<{ requireSession: void }>({
  storageState: SESSION_FILE,
  context: async ({ context }, runTest) => {
    await runTest(context);
    if (SESSION_FILE) {
      await context.storageState({ path: SESSION_FILE });
    }
  },
  // A per-test skip: a module-level `skip` here would only reach the first spec file that
  // imports this helper, and the others would fail on the login screen.
  requireSession: [
    async ({}, runTest, testInfo) => {
      testInfo.skip(
        !SESSION_FILE,
        "E2E_SESSION is not set: signed-in journeys are skipped",
      );
      await runTest();
    },
    { auto: true },
  ],
});

/** The intro leaves by itself (4 s at most); waiting is steadier than racing its skip button. */
const INTRO_GONE_TIMEOUT_MS = 6000;

/** Opens a signed-in screen and waits until the intro, if it played, has left. */
export async function openWithoutIntro(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: "networkidle" });
  await expect(page.getByRole("status", { name: "Bienvenue sur Rézone" })).toHaveCount(
    0,
    {
      timeout: INTRO_GONE_TIMEOUT_MS,
    },
  );
}

const SLIDE_START_TIMEOUT_MS = 2000;
const SLIDE_POLL_INTERVAL_MS = 25;
/** Read a little after the start, so that both screens are visibly on their way. */
const SLIDE_SETTLE_MS = 120;

/** Waits for a slide running the given keyframes to start, then reads it mid-flight. */
export async function readMidSlide(
  page: Page,
  keyframes: readonly string[],
): Promise<SlideFrame> {
  await expect
    .poll(async () => (await readSlide(page)).names, {
      timeout: SLIDE_START_TIMEOUT_MS,
      intervals: [SLIDE_POLL_INTERVAL_MS],
    })
    .toEqual(expect.arrayContaining([...keyframes]));
  await page.waitForTimeout(SLIDE_SETTLE_MS);
  return readSlide(page);
}

export interface SlideFrame {
  /** Keyframes running on the outgoing and incoming screens ("recede", "slide-in", …). */
  readonly names: readonly string[];
  /** Horizontal offset in px of the outgoing screen snapshot. */
  readonly outgoingX: number | null;
  /** Horizontal offset in px of the incoming screen snapshot. */
  readonly incomingX: number | null;
  readonly pageWidth: number;
}

/** Reads the running view-transition slide: what is painted, not the React state. */
export function readSlide(page: Page): Promise<SlideFrame> {
  return page.evaluate(() => {
    const offsetOf = (pseudo: string): number =>
      Math.round(
        new DOMMatrix(getComputedStyle(document.documentElement, pseudo).transform).m41,
      );
    const pseudos = document.getAnimations().flatMap((animation) => {
      const effect = animation.effect;
      const pseudo = effect instanceof KeyframeEffect ? effect.pseudoElement : null;
      const name = animation instanceof CSSAnimation ? animation.animationName : "";
      return pseudo && /view-transition-(old|new)/.test(pseudo) ? [{ pseudo, name }] : [];
    });
    const outgoing = pseudos.find((item) => item.pseudo.includes("-old"));
    const incoming = pseudos.find((item) => item.pseudo.includes("-new"));
    return {
      names: pseudos.map((item) => item.name),
      outgoingX: outgoing ? offsetOf(outgoing.pseudo) : null,
      incomingX: incoming ? offsetOf(incoming.pseudo) : null,
      pageWidth: document.documentElement.scrollWidth,
    };
  });
}
