import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { ProgramsBoard } from "@/features/programs/hooks/use-programs-board";

/** Deactivated tiers are kept (logs reference them) and can be switched back on. */
export function InactivePrograms({
  board,
}: {
  readonly board: ProgramsBoard;
}): ReactNode {
  if (board.inactive.length === 0) {
    return null;
  }
  return (
    <section aria-label="Paliers désactivés" className="space-y-1">
      <h3 className="text-muted-foreground text-xs font-semibold uppercase">
        Paliers désactivés
      </h3>
      <ul className="divide-border divide-y">
        {board.inactive.map((program) => (
          <li key={program.id} className="flex items-center gap-2 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground truncate text-sm">
                {program.rewardLabel}
              </p>
              <p className="text-muted-foreground text-xs">
                {program.threshold} passages
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={board.isPending || !board.canAdd}
              onClick={() => board.toggleActive(program.id, true)}
            >
              Réactiver
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
