import type {
  CardProgress,
  LoyaltyCardState,
  LoyaltyProgramSummary,
} from "@/features/loyalty/types";

function byPosition(a: LoyaltyProgramSummary, b: LoyaltyProgramSummary): number {
  return a.position - b.position;
}

/** Next active tier after `position`, wrapping to the first one (end-of-cycle loop). */
function nextActiveAfter(
  active: readonly LoyaltyProgramSummary[],
  position: number,
): LoyaltyProgramSummary | undefined {
  return active.find((program) => program.position > position) ?? active[0];
}

function resolveCurrentProgram(
  all: readonly LoyaltyProgramSummary[],
  active: readonly LoyaltyProgramSummary[],
  currentProgramId: string,
): LoyaltyProgramSummary | undefined {
  const current = all.find((program) => program.id === currentProgramId);
  if (current?.isActive) {
    return current;
  }
  // Deactivated tier (Q-013): move to the next active tier, keeping the stamps.
  return current ? nextActiveAfter(active, current.position) : active[0];
}

/**
 * Computes the displayed progression of a card (ADR-009). `stamps` is cumulative on
 * the cycle and uncapped, so `13 / 10` is valid. Returns null without any active tier.
 */
export function computeCardProgress(
  card: LoyaltyCardState,
  programs: readonly LoyaltyProgramSummary[],
): CardProgress | null {
  const all = [...programs].sort(byPosition);
  const active = all.filter((program) => program.isActive);
  const program = resolveCurrentProgram(all, active, card.currentProgramId);
  if (!program) {
    return null;
  }

  const nextProgram = nextActiveAfter(active, program.position) ?? program;
  const ratio = program.threshold > 0 ? card.stamps / program.threshold : 0;

  return {
    program,
    nextProgram,
    stamps: card.stamps,
    threshold: program.threshold,
    isRewardUnlocked: card.stamps >= program.threshold,
    progressPercent: Math.round(Math.min(1, ratio) * 100),
  };
}
