/** Must match `private.assert_program_rules` (maximum number of active tiers). */
export const MAX_ACTIVE_PROGRAMS = 5;
/** Must match the CHECK constraint on `loyalty_programs.reward_label`. */
export const REWARD_LABEL_MAX_LENGTH = 140;
export const PROGRAM_THRESHOLD_MAX = 1000;
/** Suggested gap between two tiers when proposing the threshold of a new one. */
export const DEFAULT_THRESHOLD_STEP = 10;
