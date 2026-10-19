"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import {
  type UseScannerBenchmarkReturn,
  useScannerBenchmark,
} from "../hooks/use-scanner-benchmark";
import type { ScannerEngine } from "../types";
import { SampleQrGenerator } from "./sample-qr-generator";
import { ScanMetricsList } from "./scan-metrics-list";
import { ScanSuccessBanner } from "./scan-success-banner";

const YudielQrReader = dynamic(
  () => import("./yudiel-qr-reader").then((mod) => mod.YudielQrReader),
  { ssr: false },
);

const Html5QrReader = dynamic(
  () => import("./html5-qr-reader").then((mod) => mod.Html5QrReader),
  { ssr: false },
);

function EngineSelector({
  engine,
  onSelect,
}: {
  readonly engine: ScannerEngine;
  readonly onSelect: (next: ScannerEngine) => void;
}): ReactNode {
  const btnClass = (target: ScannerEngine): string =>
    `min-h-12 rounded-lg px-3 py-2 text-xs font-bold transition ${
      engine === target ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-600"
    }`;

  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-200 p-1">
      <button
        type="button"
        onClick={() => onSelect("yudiel")}
        className={btnClass("yudiel")}
      >
        @yudiel/react-qr-scanner
      </button>
      <button
        type="button"
        onClick={() => onSelect("html5-qrcode")}
        className={btnClass("html5-qrcode")}
      >
        html5-qrcode
      </button>
    </div>
  );
}

function ActiveCameraView({
  bench,
}: {
  readonly bench: UseScannerBenchmarkReturn;
}): ReactNode {
  const { state } = bench;
  return (
    <div className="space-y-3">
      {state.engine === "yudiel" ? (
        <YudielQrReader
          isPaused={state.isPaused}
          onDecode={bench.recordDecode}
          onErrorMessage={bench.setError}
        />
      ) : (
        <Html5QrReader
          isPaused={state.isPaused}
          onDecode={bench.recordDecode}
          onErrorMessage={bench.setError}
        />
      )}
      <button
        type="button"
        onClick={bench.closeScanner}
        className="min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700"
      >
        Fermer la caméra
      </button>
    </div>
  );
}

export function ScannerBenchmarkWorkbench(): ReactNode {
  const bench = useScannerBenchmark();
  const { state } = bench;

  return (
    <div className="space-y-5">
      <EngineSelector engine={state.engine} onSelect={bench.selectEngine} />

      {!state.isCameraOpen ? (
        <button
          type="button"
          onClick={bench.openScanner}
          className="min-h-14 w-full rounded-2xl bg-zinc-950 px-6 py-4 text-base font-bold text-white shadow-sm active:scale-[0.99]"
        >
          Scanner un client (démarrer le chrono)
        </button>
      ) : (
        <ActiveCameraView bench={bench} />
      )}

      {state.errorMessage ? (
        <p
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-medium text-red-800"
        >
          {state.errorMessage}
        </p>
      ) : null}

      <ScanSuccessBanner lastScan={state.lastScan} onScanNext={bench.resumeNextScan} />
      <ScanMetricsList
        measurements={state.measurements}
        onClear={bench.clearMeasurements}
      />
      <SampleQrGenerator />
    </div>
  );
}
