import type { ReactNode } from "react";
import { RewardImage } from "@/components/shared/reward-image";
import { listActivePrograms } from "@/features/programs/domain/program-rules";
import type { ProgramView } from "@/features/programs/types";

export interface ProgramsSummaryProps {
  readonly programs: readonly ProgramView[];
}

function inactiveNote(count: number): string {
  return count === 1 ? "1 palier désactivé" : `${count} paliers désactivés`;
}

/** Read-only list of the active tiers, in order, with their reward picture. */
export function ProgramsSummary({ programs }: ProgramsSummaryProps): ReactNode {
  const active = listActivePrograms(programs);
  const inactiveCount = programs.length - active.length;

  if (active.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">Aucun palier de fidélité actif.</p>
    );
  }
  return (
    <div className="space-y-2">
      <ol className="divide-border divide-y">
        {active.map((program) => (
          <li key={program.id} className="flex items-center gap-3 py-2.5">
            <RewardImage url={program.rewardImageUrl} showPlaceholder />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{program.rewardLabel}</p>
              <p className="text-muted-foreground text-xs">
                Palier {program.position} · {program.threshold} passages
              </p>
            </div>
          </li>
        ))}
      </ol>
      {inactiveCount > 0 ? (
        <p className="text-muted-foreground text-xs">{inactiveNote(inactiveCount)}</p>
      ) : null}
    </div>
  );
}
