import Link from "next/link";
import type { ReactNode } from "react";
import { ScannerBenchmarkWorkbench } from "@/features/scanner";

export default function SpikeScannerPage(): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-4 py-6">
      <header className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            Étape 0.3 · Spike Scanner
          </span>
          <Link
            href="/"
            className="text-xs font-medium text-zinc-600 underline hover:text-zinc-900"
          >
            ← Accueil
          </Link>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950">
          Banc d&apos;essai Caméra QR
        </h1>
        <p className="text-xs text-zinc-600">
          Comparez la vitesse d&apos;ouverture et de décodage (objectif ≤ 1 300 ms) avec
          confirmation visuelle, sonore et vibration.
        </p>
      </header>

      <ScannerBenchmarkWorkbench />
    </main>
  );
}
