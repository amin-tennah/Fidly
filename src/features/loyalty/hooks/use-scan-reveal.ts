"use client";

import { useEffect, useState } from "react";
import {
  SCAN_REVEAL_COUNTER_MS,
  SCAN_REVEAL_DURATION_MS,
  SCAN_REVEAL_REDUCED_DURATION_MS,
  STAMP_VIBRATION_MS,
} from "@/features/loyalty/constants";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { useLatest } from "@/lib/use-latest";

export interface UseScanRevealReturn {
  readonly isReduced: boolean;
  /** False while the old counter is shown, true once the new stamp has landed. */
  readonly isCounted: boolean;
}

/**
 * Clock of the scan celebration: a short vibration, the counter that changes, then the end
 * (`onDone`), reached by itself or as soon as the customer touches the screen. The overlay
 * lets touches through, so the touch also reaches what is underneath.
 */
export function useScanReveal(onDone: () => void): UseScanRevealReturn {
  const [isReduced] = useState(prefersReducedMotion);
  const [isCounted, setIsCounted] = useState(isReduced);
  const onDoneRef = useLatest(onDone);

  useEffect(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(STAMP_VIBRATION_MS);
    }
    const finish = (): void => onDoneRef.current();
    const duration = isReduced
      ? SCAN_REVEAL_REDUCED_DURATION_MS
      : SCAN_REVEAL_DURATION_MS;
    const countTimer = window.setTimeout(
      () => setIsCounted(true),
      SCAN_REVEAL_COUNTER_MS,
    );
    const endTimer = window.setTimeout(finish, duration);
    window.addEventListener("pointerdown", finish);
    return () => {
      window.clearTimeout(countTimer);
      window.clearTimeout(endTimer);
      window.removeEventListener("pointerdown", finish);
    };
  }, [isReduced, onDoneRef]);

  return { isReduced, isCounted };
}
