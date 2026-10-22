import type { AppErrorCode } from "@/lib/errors";

/**
 * Maps a Supabase Auth error code (`AuthError.code`) to a user-facing app
 * error code. Unknown codes fall back to a generic message (no technical leak).
 * Reference: https://supabase.com/docs/guides/auth/debugging/error-codes
 */
export function mapAuthErrorCode(code: string | undefined): AppErrorCode {
  switch (code) {
    case "otp_expired":
    case "otp_disabled":
    case "invalid_credentials":
      return "OTP_INVALID";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "RATE_LIMITED";
    case "email_address_invalid":
    case "validation_failed":
      return "VALIDATION_ERROR";
    default:
      return "AUTH_FAILED";
  }
}
