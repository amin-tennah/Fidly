"use client";

import { useEffect, useState } from "react";
import {
  INTRO_EXIT_DURATION_MS,
  INTRO_MIN_DURATION_MS,
} from "@/features/loyalty/constants";

export type IntroPhase = "visible" | "leaving" | "hidden";

/** Module scope: survives client-side navigation, reset by a full reload (= app opening). */
let hasPlayed = false;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Plays the intro once per app opening. Server data is already rendered when the page
 * hydrates, so the intro only lasts the minimum time the stamp needs to land.
 */
export function useIntroSplash(): { phase: IntroPhase; skip: () => void } {
  const [phase, setPhase] = useState<IntroPhase>(hasPlayed ? "hidden" : "visible");

  useEffect(() => {
    if (phase !== "visible") {
      return;
    }
    hasPlayed = true;
    const isReduced = prefersReducedMotion();
    const timer = window.setTimeout(
      () => setPhase(isReduced ? "hidden" : "leaving"),
      isReduced ? 0 : INTRO_MIN_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") {
      return;
    }
    const timer = window.setTimeout(() => setPhase("hidden"), INTRO_EXIT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return { phase, skip: () => setPhase("leaving") };
}
