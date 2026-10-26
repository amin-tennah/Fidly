"use client";

import { useState } from "react";

/**
 * True when the component mounts well after the page was loaded, i.e. because the data
 * changed while the customer was looking (a reward just unlocked), not on first paint.
 */
export function useIsLateMount(thresholdMs: number): boolean {
  const [isLate] = useState(() => performance.now() > thresholdMs);
  return isLate;
}
