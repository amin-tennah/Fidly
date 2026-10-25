"use client";

import { useEffect } from "react";
import { SCAN_SUCCESS_DISPLAY_MS } from "@/features/scanner/constants";
import type { ScanFlowState } from "@/features/scanner/domain/scan-flow-reducer";

/** Closes the success state by itself, unless an error or a cancellation is pending. */
export function useAutoClose(state: ScanFlowState, close: () => void): void {
  const isAutoClosing = state.step === "done" && !state.error && !state.isReversing;

  useEffect(() => {
    if (!isAutoClosing) {
      return;
    }
    const timer = setTimeout(close, SCAN_SUCCESS_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [isAutoClosing, close]);
}
