"use client";

import { useCallback, useReducer, useRef } from "react";
import {
  INITIAL_SCAN_FLOW,
  scanFlowReducer,
  type ScanFlowState,
} from "@/features/scanner/domain/scan-flow-reducer";
import {
  runLookup,
  runReverse,
  runReward,
  runVisit,
} from "@/features/scanner/hooks/scan-flow-runners";
import { useAutoClose } from "@/features/scanner/hooks/use-auto-close";

export interface ScanFlow {
  readonly state: ScanFlowState;
  readonly decode: (raw: string) => void;
  readonly validateVisit: () => void;
  readonly validateReward: () => void;
  readonly cancelLastScan: () => void;
  readonly close: () => void;
}

/** Drives scan → drawer → confirmation for the restaurant shown on screen. */
export function useScanFlow(restaurantId: string): ScanFlow {
  const [state, dispatch] = useReducer(scanFlowReducer, INITIAL_SCAN_FLOW);
  // Camera libraries emit several detections per second: lock on the first one.
  const isLockedRef = useRef(false);

  const close = useCallback((): void => {
    isLockedRef.current = false;
    dispatch({ type: "closed" });
  }, []);

  const decode = useCallback(
    (raw: string): void => {
      if (isLockedRef.current) {
        return;
      }
      isLockedRef.current = true;
      void runLookup(dispatch, restaurantId, raw).then((found) => {
        isLockedRef.current = found;
      });
    },
    [restaurantId],
  );

  const validateVisit = useCallback((): void => {
    if (state.step === "customer" && !state.isSubmitting) {
      void runVisit(dispatch, restaurantId, state.customer, state.keys);
    }
  }, [restaurantId, state]);

  const validateReward = useCallback((): void => {
    if (state.step === "customer" && !state.isSubmitting && state.customer.cardId) {
      void runReward(dispatch, restaurantId, state.customer.cardId, state.keys);
    }
  }, [restaurantId, state]);

  const cancelLastScan = useCallback((): void => {
    if (state.step === "done" && !state.isReversing) {
      void runReverse(dispatch, restaurantId, state.outcome, state.keys).then((done) => {
        isLockedRef.current = !done;
      });
    }
  }, [restaurantId, state]);

  useAutoClose(state, close);

  return { state, decode, validateVisit, validateReward, cancelLastScan, close };
}
