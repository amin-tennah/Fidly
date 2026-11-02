"use client";

import { useEffect, useState } from "react";
import { JUST_ADDED_DURATION_MS, STAMP_VIBRATION_MS } from "@/features/loyalty/constants";

/**
 * True for a short while after `count` increased (a stamp was just credited, e.g. via Realtime).
 * Stays false on the first render and when the counter goes down or is unchanged.
 */
export function useJustAdded(count: number): boolean {
  const [previous, setPrevious] = useState(count);
  const [isJustAdded, setIsJustAdded] = useState(false);

  if (count !== previous) {
    setPrevious(count);
    setIsJustAdded(count > previous);
  }

  useEffect(() => {
    if (!isJustAdded) {
      return;
    }
    if ("vibrate" in navigator) {
      navigator.vibrate(STAMP_VIBRATION_MS);
    }
    const timer = window.setTimeout(() => setIsJustAdded(false), JUST_ADDED_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [isJustAdded]);

  return isJustAdded;
}
