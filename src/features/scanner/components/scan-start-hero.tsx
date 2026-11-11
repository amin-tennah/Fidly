import { ScanLine } from "lucide-react";
import type { ReactNode } from "react";

export interface ScanStartHeroProps {
  readonly onStart: () => void;
}

/** The main action of the restaurant home: the largest object on the screen. */
export function ScanStartHero({ onStart }: ScanStartHeroProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onStart}
      className="bg-primary text-primary-foreground focus-visible:ring-ring rounded-screen shadow-hero flex min-h-[150px] w-full flex-col items-center justify-center gap-3 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99]"
    >
      <ScanLine className="text-gain size-10" strokeWidth={2.5} aria-hidden="true" />
      <span className="font-display text-2xl font-extrabold">Scanner un client</span>
    </button>
  );
}
