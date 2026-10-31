/** Display only: the 2 h cooldown is enforced by `record_visit` in the database. */
export const SCAN_COOLDOWN_HOURS = 2;

/** `profiles.qr_token` (ADR-013) and `profiles.short_code` formats. */
export const QR_TOKEN_LENGTH = 20;
export const SHORT_CODE_LENGTH = 6;
/** Longest raw input considered when reading a scanned or typed code. */
export const SCAN_INPUT_MAX_LENGTH = 64;

/** How long the success state stays on screen before the scanner is ready again. */
export const SCAN_SUCCESS_DISPLAY_MS = 6000;
