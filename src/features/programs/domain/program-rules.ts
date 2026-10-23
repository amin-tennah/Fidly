import {
  DEFAULT_THRESHOLD_STEP,
  MAX_ACTIVE_PROGRAMS,
} from "@/features/programs/constants";
import type { ProgramRuleViolation, ProgramView } from "@/features/programs/types";

export function listActivePrograms(
  programs: readonly ProgramView[],
): readonly ProgramView[] {
  return programs.filter((p) => p.isActive).sort((a, b) => a.position - b.position);
}

/**
 * Mirror of the database rules (`private.assert_program_rules`), used to give instant
 * feedback: at most `MAX_ACTIVE_PROGRAMS` active tiers, thresholds strictly increasing.
 * The database stays the authority.
 */
export function findRuleViolation(
  programs: readonly ProgramView[],
): ProgramRuleViolation | null {
  const active = listActivePrograms(programs);
  if (active.length > MAX_ACTIVE_PROGRAMS) {
    return "too_many";
  }
  const isIncreasing = active.every(
    (p, i) => i === 0 || p.threshold > (active[i - 1]?.threshold ?? 0),
  );
  return isIncreasing ? null : "not_increasing";
}

/** Threshold proposed for a new tier: one step above the last active tier. */
export function suggestNextThreshold(programs: readonly ProgramView[]): number {
  const last = listActivePrograms(programs).at(-1);
  return (last?.threshold ?? 0) + DEFAULT_THRESHOLD_STEP;
}

/**
 * Result of dragging tiers into `orderedIds`: positions follow the list and thresholds stay
 * on the places (the tier moved up takes the lower threshold), exactly as the RPC does.
 */
export function previewReorder(
  programs: readonly ProgramView[],
  orderedIds: readonly string[],
): readonly ProgramView[] {
  const active = listActivePrograms(programs);
  const thresholds = active.map((p) => p.threshold);
  const byId = new Map(active.map((p) => [p.id, p]));
  const reordered = orderedIds.flatMap((id, index) => {
    const program = byId.get(id);
    const threshold = thresholds[index];
    return program && threshold !== undefined
      ? [{ ...program, position: index + 1, threshold }]
      : [];
  });
  const inactive = programs
    .filter((p) => !p.isActive)
    .sort((a, b) => a.position - b.position)
    .map((p, index) => ({ ...p, position: reordered.length + index + 1 }));
  return [...reordered, ...inactive];
}
