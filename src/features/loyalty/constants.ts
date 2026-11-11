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

/**
 * Intro splash: minimum time on screen (the stamp lands and its ripple fades, ~1.85 s),
 * ceiling when the home is slow to load, and the slide-out duration (--dur-slide).
 */
export const INTRO_MIN_DURATION_MS = 1900;
export const INTRO_MAX_DURATION_MS = 4000;
export const INTRO_EXIT_DURATION_MS = 500;

/** How long the "+1" celebration stays on a card after its counter increased. */
export const JUST_ADDED_DURATION_MS = 1200;
/** Vibration pulse (ms) when a stamp lands, where the device supports it. */
export const STAMP_VIBRATION_MS = 30;

/** Route of a restaurant card (detail screen): "/cartes/<restaurant slug>". */
export const CARD_DETAIL_PATH = "/cartes";

/** A reward banner mounted later than this after page load was just unlocked: celebrate once. */
export const FIRST_PAINT_GRACE_MS = 4000;

/**
 * Scan celebration "carte dévoilée" (06-DA-ITERATION-2 §2): total time on screen, the
 * moment the counter rolls and the new segment lands (mirrors the `rollIn` delay in
 * globals.css), and the shorter stay of the reduced-motion fallback.
 */
export const SCAN_REVEAL_DURATION_MS = 3400;
export const SCAN_REVEAL_COUNTER_MS = 900;
export const SCAN_REVEAL_REDUCED_DURATION_MS = 2200;

/** Confetti thrown from the centre of a celebration: size of the burst and its timing. */
export const SCAN_REVEAL_CONFETTI = {
  count: 12,
  spreadPx: 130,
  risePx: 30,
  fallPx: 140,
  delayMs: 1000,
} as const;
export const REWARD_MEDAL_CONFETTI = {
  count: 24,
  spreadPx: 230,
  risePx: 90,
  fallPx: 420,
  delayMs: 1500,
} as const;
/** Colours a confetti piece cycles through (card light tone, lime, cream, card dark tone). */
export const CONFETTI_COLOR_COUNT = 4;

/** sessionStorage key listing the rewards whose medal was already shown ("card:tier"). */
export const REWARD_SEEN_STORAGE_KEY = "rezone.reward-seen.v1";
