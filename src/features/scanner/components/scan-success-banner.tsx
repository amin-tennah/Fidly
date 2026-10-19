"use client";

import type { ReactNode } from "react";
import { SCAN_BUDGET_MS, type ScanMeasurement } from "../types";

interface ScanSuccessBannerProps {
  readonly lastScan: ScanMeasurement | null;
  readonly onScanNext: () => void;
}

function ScanSuccessHeader({ scan }: { readonly scan: ScanMeasurement }): ReactNode {
  const badgeTone =
    scan.elapsedMs <= SCAN_BUDGET_MS
      ? "bg-emerald-200 text-emerald-900"
      : "bg-amber-200 text-amber-900";
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xl font-bold text-white">
        ✓
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-emerald-900">QR Code scanné avec succès !</p>
        <p className="truncate font-mono text-xs text-emerald-800">
          Jeton : {scan.decodedValue}
        </p>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 font-mono text-xs font-bold ${badgeTone}`}
      >
        {scan.elapsedMs} ms
      </span>
    </div>
  );
}

export function ScanSuccessBanner({
  lastScan,
  onScanNext,
}: ScanSuccessBannerProps): ReactNode {
  if (!lastScan) {
    return null;
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 text-emerald-950 shadow-md"
    >
      <ScanSuccessHeader scan={lastScan} />
      <button
        type="button"
        onClick={onScanNext}
        className="mt-3 min-h-12 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white active:scale-[0.99]"
      >
        Scanner le client suivant (caméra chaude)
      </button>
    </div>
  );
}
