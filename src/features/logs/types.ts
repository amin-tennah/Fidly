export type ScanLogType = "visit" | "reward_redeemed" | "reversal";

/** One line of the journal, ready to display. Dates stay ISO strings (cursor precision). */
export interface ScanLogEntry {
  readonly id: string;
  readonly createdAt: string;
  readonly type: ScanLogType;
  readonly rewardLabel: string;
  /** `null` once the customer deleted their account (GDPR anonymisation, ADR-012). */
  readonly customerName: string | null;
  /** `null` once the employee deleted their account. */
  readonly staffName: string | null;
  readonly isCooldownOverridden: boolean;
  /** A reversal entry points to the log it cancels. */
  readonly reversesLogId: string | null;
  readonly isReversed: boolean;
  readonly reversedAt: string | null;
}

export interface ScanLogCursor {
  readonly createdAt: string;
  readonly id: string;
}

export interface ScanLogPage {
  readonly entries: readonly ScanLogEntry[];
  readonly hasMore: boolean;
}
