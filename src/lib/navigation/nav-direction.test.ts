import { beforeEach, describe, expect, it } from "vitest";
import {
  consumePop,
  hasInAppBackEntry,
  markForwardNavigation,
  resetNavDirection,
} from "@/lib/navigation/nav-direction";

describe("nav-direction", () => {
  beforeEach(() => resetNavDirection());

  it("has no in-app back entry on a fresh load", () => {
    expect(hasInAppBackEntry()).toBe(false);
  });

  it("tracks forward steps and pops", () => {
    markForwardNavigation();
    markForwardNavigation();
    consumePop();
    expect(hasInAppBackEntry()).toBe(true);
    consumePop();
    expect(hasInAppBackEntry()).toBe(false);
  });

  it("never goes below zero when the user pops past the app entry", () => {
    consumePop();
    consumePop();
    markForwardNavigation();
    expect(hasInAppBackEntry()).toBe(true);
  });
});
