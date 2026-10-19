"use client";

import type { ReactNode } from "react";
import { SCAN_BUDGET_MS, type ScanMeasurement } from "../types";

interface ScanMetricsListProps {
  readonly measurements: readonly ScanMeasurement[];
  readonly onClear: () => void;
}

function ScanMetricRow({ item }: { readonly item: ScanMeasurement }): ReactNode {
  const tone = item.elapsedMs <= SCAN_BUDGET_MS ? "text-emerald-700" : "text-amber-700";
  return (
    <li className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2">
      <div>
        <span className="font-semibold text-zinc-900">{item.engine}</span>
        <span className="ml-2 text-zinc-500">
          ({item.warmStart ? "caméra chaude" : "1re ouverture"})
        </span>
        <p className="font-mono text-[11px] text-zinc-600">
          {item.decodedValue} · {item.timestamp}
        </p>
      </div>
      <span className={`font-mono font-bold ${tone}`}>{item.elapsedMs} ms</span>
    </li>
  );
}

export function ScanMetricsList({
  measurements,
  onClear,
}: ScanMetricsListProps): ReactNode {
  if (measurements.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500">
        Aucun scan mesuré pour le moment.
      </p>
    );
  }

  return (
    <section
      aria-label="Journal des mesures de scan"
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-zinc-900">
          Mesures ({measurements.length}) · Budget ≤ {SCAN_BUDGET_MS} ms
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-zinc-500 underline"
        >
          Réinitialiser
        </button>
      </div>
      <ul className="space-y-2 text-xs">
        {measurements.map((item) => (
          <ScanMetricRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
