import { describe, expect, it } from "vitest";
import {
  initialIntroPhase,
  INTRO_CLOCK_START,
  introPhaseAt,
  shouldIntroLeave,
} from "./intro-phase";

describe("initialIntroPhase", () => {
  it("plays at once when the app opens on the home (existing session)", () => {
    expect(initialIntroPhase("home")).toBe("visible");
  });

  it("is armed on a sign-in screen and off anywhere else", () => {
    expect(initialIntroPhase("auth")).toBe("armed");
    expect(initialIntroPhase("other")).toBe("off");
  });
});

describe("introPhaseAt", () => {
  it("starts when the home is reached after signing in", () => {
    expect(introPhaseAt("armed", "home")).toBe("visible");
  });

  it("does not replay on a later return to the home", () => {
    expect(introPhaseAt("hidden", "home")).toBe("hidden");
    expect(introPhaseAt("hidden", "other")).toBe("hidden");
  });

  it("does not play when the app was opened on another screen", () => {
    expect(introPhaseAt("off", "home")).toBe("off");
  });

  it("is re-armed by a new sign-in", () => {
    expect(introPhaseAt("hidden", "auth")).toBe("armed");
    expect(introPhaseAt("off", "auth")).toBe("armed");
  });

  it("is not interrupted while it plays", () => {
    expect(introPhaseAt("visible", "home")).toBe("visible");
    expect(introPhaseAt("leaving", "other")).toBe("leaving");
  });
});

describe("shouldIntroLeave", () => {
  it("stays until the stamp has landed, even when the home is ready", () => {
    expect(shouldIntroLeave(INTRO_CLOCK_START, true)).toBe(false);
  });

  it("waits for the home after the minimum time", () => {
    const clock = { hasMinElapsed: true, hasMaxElapsed: false };
    expect(shouldIntroLeave(clock, false)).toBe(false);
    expect(shouldIntroLeave(clock, true)).toBe(true);
  });

  it("leaves at the ceiling even when the home is not ready", () => {
    const clock = { hasMinElapsed: true, hasMaxElapsed: true };
    expect(shouldIntroLeave(clock, false)).toBe(true);
  });
});
