import type { ReactNode } from "react";

export interface PillProps {
  readonly children: ReactNode;
}

/** Lime label above a screen title (e.g. « Espace Pro · Gérant »), 05b-ECRANS-SPEC §7. */
export function Pill({ children }: PillProps): ReactNode {
  return (
    <span className="bg-gain text-gain-foreground inline-flex items-center rounded-full px-3 py-1 text-[13px] font-extrabold">
      {children}
    </span>
  );
}
