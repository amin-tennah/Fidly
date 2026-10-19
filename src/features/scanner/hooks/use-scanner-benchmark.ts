"use client";

import { useReducer } from "react";
import type { ScanMeasurement, ScannerEngine } from "../types";
import { triggerScanFeedback } from "../utils/scan-feedback";

export interface ScannerBenchmarkState {
  readonly engine: ScannerEngine;
  readonly isCameraOpen: boolean;
  readonly isPaused: boolean;
  readonly isWarmStart: boolean;
  readonly startedAtMs: number;
  readonly lastScan: ScanMeasurement | null;
  readonly measurements: readonly ScanMeasurement[];
  readonly errorMessage: string | null;
}

type BenchmarkAction =
  | { readonly type: "SELECT_ENGINE"; readonly engine: ScannerEngine }
  | { readonly type: "OPEN"; readonly now: number }
  | { readonly type: "CLOSE" }
  | { readonly type: "RESUME"; readonly now: number }
  | { readonly type: "DECODE"; readonly value: string; readonly now: number }
  | { readonly type: "ERROR"; readonly message: string }
  | { readonly type: "CLEAR" };

const INITIAL_STATE: ScannerBenchmarkState = {
  engine: "yudiel",
  isCameraOpen: false,
  isPaused: false,
  isWarmStart: false,
  startedAtMs: 0,
  lastScan: null,
  measurements: [],
  errorMessage: null,
};

function applyOpen(state: ScannerBenchmarkState, now: number): ScannerBenchmarkState {
  return {
    ...state,
    isCameraOpen: true,
    isPaused: false,
    isWarmStart: false,
    startedAtMs: now,
    lastScan: null,
    errorMessage: null,
  };
}

function applyDecode(
  state: ScannerBenchmarkState,
  decodedValue: string,
  now: number,
): ScannerBenchmarkState {
  if (state.isPaused) {
    return state;
  }
  const entry: ScanMeasurement = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    engine: state.engine,
    decodedValue,
    elapsedMs: Math.round(now - state.startedAtMs),
    warmStart: state.isWarmStart,
    timestamp: new Date().toLocaleTimeString("fr-FR"),
  };
  return {
    ...state,
    isPaused: true,
    lastScan: entry,
    measurements: [entry, ...state.measurements],
  };
}

function benchmarkReducer(
  state: ScannerBenchmarkState,
  action: BenchmarkAction,
): ScannerBenchmarkState {
  switch (action.type) {
    case "SELECT_ENGINE":
      return {
        ...INITIAL_STATE,
        measurements: state.measurements,
        engine: action.engine,
      };
    case "OPEN":
      return applyOpen(state, action.now);
    case "CLOSE":
      return { ...state, isCameraOpen: false, isPaused: false };
    case "RESUME":
      return {
        ...state,
        isPaused: false,
        isWarmStart: true,
        startedAtMs: action.now,
        lastScan: null,
      };
    case "DECODE":
      return applyDecode(state, action.value, action.now);
    case "ERROR":
      return { ...state, errorMessage: action.message };
    case "CLEAR":
      return { ...state, lastScan: null, measurements: [] };
    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}

export interface UseScannerBenchmarkReturn {
  readonly state: ScannerBenchmarkState;
  readonly selectEngine: (engine: ScannerEngine) => void;
  readonly openScanner: () => void;
  readonly closeScanner: () => void;
  readonly resumeNextScan: () => void;
  readonly recordDecode: (decodedValue: string) => void;
  readonly setError: (message: string) => void;
  readonly clearMeasurements: () => void;
}

export function useScannerBenchmark(): UseScannerBenchmarkReturn {
  const [state, dispatch] = useReducer(benchmarkReducer, INITIAL_STATE);

  return {
    state,
    selectEngine: (engine) => dispatch({ type: "SELECT_ENGINE", engine }),
    openScanner: () => dispatch({ type: "OPEN", now: performance.now() }),
    closeScanner: () => dispatch({ type: "CLOSE" }),
    resumeNextScan: () => dispatch({ type: "RESUME", now: performance.now() }),
    recordDecode: (value) => {
      triggerScanFeedback();
      dispatch({ type: "DECODE", value, now: performance.now() });
    },
    setError: (message) => dispatch({ type: "ERROR", message }),
    clearMeasurements: () => dispatch({ type: "CLEAR" }),
  };
}
