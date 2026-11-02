/** Shown instead of the short code while the profile is not loaded. */
export const SHORT_CODE_PLACEHOLDER = "--- ---";
export const SHORT_CODE_LENGTH = 6;
export const SHORT_CODE_GROUP_SIZE = 3;

/** QR rendering: pure white background, 4-module quiet zone, error correction level M. */
export const QR_SIZE_PX = 232;
export const QR_QUIET_ZONE_MODULES = 4;
export const QR_FOREGROUND_COLOR = "#000000";
export const QR_BACKGROUND_COLOR = "#FFFFFF";

/** Number of card colours (--hue-1 … --hue-6 in globals.css). */
export const CARD_HUE_COUNT = 6;

/** Segmented progress: at most this many segments per row (a 20-stamp tier takes two rows). */
export const SEGMENTS_PER_ROW = 10;

/** Delay between two segments in the reward wave (segWave). */
export const SEGMENT_WAVE_STEP_MS = 40;

/** Confetti pieces thrown around the hero card on a new stamp (half card colour, half cream). */
export const BURST_PARTICLE_COUNT = 8;

/** Intro splash: minimum time on screen so the stamp can land, and the slide-out duration (--dur-slide). */
export const INTRO_MIN_DURATION_MS = 1400;
export const INTRO_EXIT_DURATION_MS = 500;

/** How long the "+1" celebration stays on a card after its counter increased. */
export const JUST_ADDED_DURATION_MS = 1200;
/** Vibration pulse (ms) when a stamp lands, where the device supports it. */
export const STAMP_VIBRATION_MS = 30;
