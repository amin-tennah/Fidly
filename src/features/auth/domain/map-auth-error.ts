import type { AppErrorCode } from "@/lib/errors";

/**
 * Sending the code: a 5xx from Auth means the email provider (custom SMTP) failed,
 * which the user can neither fix nor blame on their address. The SDK drops the
 * error code on a 5xx, so the HTTP status is what identifies it.
 */
export function mapSendOtpErrorCode(
  code: string | undefined,
  status: number | undefined,
): AppErrorCode {
  if (status !== undefined && status >= 500) {
    return "EMAIL_SEND_FAILED";
  }
  return mapAuthErrorCode(code);
}

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
