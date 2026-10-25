export const SCAN_BUDGET_MS = 1300;

/** A customer as seen by the restaurant: first name and progression only. */
export interface CustomerLookup {
  readonly customerId: string;
  readonly displayName: string;
  /** `null` until the first visit creates the card. */
  readonly cardId: string | null;
  readonly rewardLabel: string;
  readonly stamps: number;
  readonly threshold: number;
  readonly isRewardUnlocked: boolean;
  readonly isInCooldown: boolean;
  readonly cooldownRemainingSeconds: number;
}

/** State of a card after a visit, a redemption or a reversal. */
export interface ScanOutcome {
  readonly logId: string;
  readonly cardId: string;
  readonly rewardLabel: string;
  readonly stamps: number;
  readonly threshold: number;
  readonly isRewardUnlocked: boolean;
  readonly isReplay: boolean;
}

export type ScanActionKind = "visit" | "redeem";

/** One idempotency key per action on a customer; a retry reuses the same key. */
export interface ScanKeys {
  readonly visit: string;
  readonly redeem: string;
  readonly reverse: string;
}

export type DoneKind = ScanActionKind | "reverse";
