import Link from "next/link";
import type { ReactNode } from "react";

export default function HomePage(): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-4 py-8">
      <header className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Fidly · Zéro Friction
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Votre carte de fidélité universelle de quartier
        </h1>
        <p className="text-sm text-zinc-600">
          Présentez votre QR code unique en caisse pour cumuler vos passages et débloquer
          vos récompenses en moins de 3 secondes.
        </p>
      </header>

      <section
        aria-label="Aperçu du QR code client"
        className="my-6 flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs"
      >
        <div className="flex h-44 w-44 items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 text-center text-xs text-zinc-500">
          QR code personnel (Phase 4)
        </div>
        <p className="mt-4 font-mono text-sm font-semibold tracking-widest text-zinc-800">
          CODE : --- ---
        </p>
      </section>

      <div className="space-y-3">
        <Link
          href="/spike-scanner"
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white shadow-xs"
        >
          Ouvrir le banc d&apos;essai Scanner (Étape 0.3) →
        </Link>
        <footer className="text-center text-xs text-zinc-500">
          Socle technique Fidly · Phase 1 + Spike 0.3
        </footer>
      </div>
    </main>
  );
}
