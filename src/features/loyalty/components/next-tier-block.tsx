import type { ReactNode } from "react";
import type { CardProgress } from "@/features/loyalty/types";

export interface NextTierBlockProps {
  readonly progress: CardProgress;
}

/** "Ensuite": the next tier and the cumulative counter towards it. Hidden when there is only one tier. */
export function NextTierBlock({ progress }: NextTierBlockProps): ReactNode {
  const { nextProgram, program, stamps } = progress;
  if (nextProgram.id === program.id) {
    return null;
  }
  return (
    <div className="border-border rounded-block flex items-center justify-between gap-3 border-2 px-4 py-3">
      <div className="min-w-0">
        <p className="text-muted-foreground text-sm">Ensuite</p>
        <p className="text-base font-extrabold">
          Palier {nextProgram.position} · {nextProgram.rewardLabel} à{" "}
          {nextProgram.threshold}
        </p>
      </div>
      <p className="text-primary font-display shrink-0 text-[22px] font-extrabold">
        {stamps} / {nextProgram.threshold}
      </p>
    </div>
  );
}
