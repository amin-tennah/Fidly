/** A tier as shown in `/pro/settings` (active or deactivated). */
export interface ProgramView {
  readonly id: string;
  readonly position: number;
  readonly threshold: number;
  readonly rewardLabel: string;
  readonly isActive: boolean;
  readonly rewardImageUrl: string | null;
}

export type ProgramRuleViolation = "too_many" | "not_increasing";
