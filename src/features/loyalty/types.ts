/** A loyalty tier of a restaurant (`loyalty_programs`), cumulative threshold (ADR-009). */
export interface LoyaltyProgramSummary {
  readonly id: string;
  readonly position: number;
  readonly threshold: number;
  readonly rewardLabel: string;
  readonly isActive: boolean;
}

/** Minimal card state needed to compute its progression. */
export interface LoyaltyCardState {
  readonly stamps: number;
  readonly currentProgramId: string;
}

export interface CardProgress {
  readonly program: LoyaltyProgramSummary;
  readonly nextProgram: LoyaltyProgramSummary;
  readonly stamps: number;
  readonly threshold: number;
  readonly isRewardUnlocked: boolean;
  /** Progress bar fill, from 0 to 100 (capped when stamps exceed the threshold). */
  readonly progressPercent: number;
}

/** Display-ready card: `progress` is null when the restaurant has no active program. */
export interface LoyaltyCardView {
  readonly cardId: string;
  readonly restaurantName: string;
  readonly restaurantSlug: string;
  readonly progress: CardProgress | null;
}
