import { test as base, type Page } from "@playwright/test";

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

export const signedInTest = base.extend({
  storageState: SESSION_FILE,
  context: async ({ context }, runTest) => {
    await runTest(context);
    if (SESSION_FILE) {
      await context.storageState({ path: SESSION_FILE });
    }
  },
});

signedInTest.skip(
  !SESSION_FILE,
  "E2E_SESSION is not set: signed-in journeys are skipped",
);

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
