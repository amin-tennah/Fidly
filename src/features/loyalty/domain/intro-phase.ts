/**
 * Intro splash state (05-DIRECTION-ARTISTIQUE §5.3), as pure functions.
 * - "off": the app was opened elsewhere (e.g. /pro): no intro on a later visit to the home.
 * - "armed": on a sign-in screen, the intro will play when the home is reached.
 * - "visible" → "leaving" (slide-out) → "hidden".
 */
export type IntroPhase = "off" | "armed" | "visible" | "leaving" | "hidden";

/** Where the user is: the client home, a sign-in screen (login, onboarding) or anything else. */
export type IntroLocation = "home" | "auth" | "other";

export interface IntroClock {
  /** The stamp has landed (minimum time on screen). */
  readonly hasMinElapsed: boolean;
  /** Ceiling: the intro never holds the user longer than this. */
  readonly hasMaxElapsed: boolean;
}

export const INTRO_CLOCK_START: IntroClock = {
  hasMinElapsed: false,
  hasMaxElapsed: false,
};

/** Phase when the app opens on `location`. */
export function initialIntroPhase(location: IntroLocation): IntroPhase {
  if (location === "home") {
    return "visible";
  }
  return location === "auth" ? "armed" : "off";
}

/** Phase after a navigation to `location`: a sign-in screen (re)arms, the home starts the intro. */
export function introPhaseAt(phase: IntroPhase, location: IntroLocation): IntroPhase {
  if (location === "auth" && (phase === "off" || phase === "hidden")) {
    return "armed";
  }
  if (location === "home" && phase === "armed") {
    return "visible";
  }
  return phase;
}

/** Leaves once the stamp has landed and the home is ready, or at the ceiling whatever happens. */
export function shouldIntroLeave(clock: IntroClock, isHomeReady: boolean): boolean {
  return clock.hasMaxElapsed || (clock.hasMinElapsed && isHomeReady);
}
