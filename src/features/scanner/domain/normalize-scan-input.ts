import {
  QR_TOKEN_LENGTH,
  SCAN_INPUT_MAX_LENGTH,
  SHORT_CODE_LENGTH,
} from "@/features/scanner/constants";

export type ScanInputKind = "qr_token" | "short_code" | "invalid";

const QR_TOKEN_PATTERN = new RegExp(`^[A-Z2-7]{${QR_TOKEN_LENGTH}}$`);
const SHORT_CODE_PATTERN = new RegExp(
  `^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{${SHORT_CODE_LENGTH}}$`,
);

/** Upper-cases and drops spaces and dashes (a code is often typed as `ABC-123`). */
export function normalizeScanInput(raw: string): string {
  return raw.slice(0, SCAN_INPUT_MAX_LENGTH).replace(/[\s-]/g, "").toUpperCase();
}

/** The content of a scanned QR is untrusted: only the two known formats are forwarded. */
export function classifyScanInput(raw: string): ScanInputKind {
  const normalized = normalizeScanInput(raw);
  if (QR_TOKEN_PATTERN.test(normalized)) {
    return "qr_token";
  }
  return SHORT_CODE_PATTERN.test(normalized) ? "short_code" : "invalid";
}
