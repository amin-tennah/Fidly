"use client";

import { useEffect, useState } from "react";
import {
  INTRO_MAX_DURATION_MS,
  INTRO_MIN_DURATION_MS,
} from "@/features/loyalty/constants";
import {
  INTRO_CLOCK_START,
  type IntroClock,
} from "@/features/loyalty/domain/intro-phase";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Runs the minimum and maximum timers while the intro is visible. `readElapsedMs` tells how
 * long the intro has already been animating: when it was server-rendered, it started at
 * first paint, well before this hook runs. With reduced motion nothing is animated, so
 * there is no minimum: the intro only covers the loading.
 */
export function useIntroClock(
  isRunning: boolean,
  readElapsedMs: () => number,
): IntroClock {
  const [clock, setClock] = useState<IntroClock>(INTRO_CLOCK_START);

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const elapsedMs = readElapsedMs();
    const minMs = prefersReducedMotion() ? 0 : INTRO_MIN_DURATION_MS - elapsedMs;
    const minTimer = window.setTimeout(
      () => setClock((current) => ({ ...current, hasMinElapsed: true })),
      Math.max(0, minMs),
    );
    const maxTimer = window.setTimeout(
      () => setClock({ hasMinElapsed: true, hasMaxElapsed: true }),
      Math.max(0, INTRO_MAX_DURATION_MS - elapsedMs),
    );
    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
      setClock(INTRO_CLOCK_START);
    };
  }, [isRunning, readElapsedMs]);

  return clock;
}
