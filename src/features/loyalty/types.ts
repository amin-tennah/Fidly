/** A loyalty tier of a restaurant (`loyalty_programs`), cumulative threshold (ADR-009). */
export interface LoyaltyProgramSummary {
  readonly id: string;
  readonly position: number;
  readonly threshold: number;
  readonly rewardLabel: string;
  readonly isActive: boolean;
  readonly rewardImageUrl: string | null;
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
  readonly restaurantId: string;
  readonly restaurantName: string;
  readonly restaurantSlug: string;
  readonly restaurantLogoUrl: string | null;
  readonly restaurantCoverUrl: string | null;
  readonly progress: CardProgress | null;
}

/** What a celebration overlay needs to know about the card it celebrates. */
interface CardCelebrationBase {
  readonly cardId: string;
  readonly restaurantName: string;
  readonly restaurantLogoUrl: string | null;
  /** Card colour index, 1 to 6 (see getCardHue). */
  readonly hue: number;
  /** Progression after the change, as confirmed by the server. */
  readonly progress: CardProgress;
}

/** One or several stamps were credited: the counter goes from `from` to `to`. */
export interface StampCelebration extends CardCelebrationBase {
  readonly kind: "stamp";
  readonly from: number;
  readonly to: number;
}

/** The reward of the current tier just became available. */
export interface RewardCelebration extends CardCelebrationBase {
  readonly kind: "reward";
}

export type CardCelebration = StampCelebration | RewardCelebration;
