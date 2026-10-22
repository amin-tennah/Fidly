/** Auth routes (pure constants, safe for proxy, server and client code). */
export const LOGIN_PATH = "/login";
export const AUTH_CALLBACK_PATH = "/auth/callback";
export const ONBOARDING_PATH = "/onboarding";
export const INVITATION_PATH = "/invitation";
export const CLIENT_HOME_PATH = "/";
export const PRO_HOME_PATH = "/pro";
export const ADMIN_HOME_PATH = "/admin";

/** Query parameter carrying the post-login destination. */
export const NEXT_PARAM = "next";
/** Query parameter carrying a login error code (e.g. failed OAuth callback). */
export const LOGIN_ERROR_PARAM = "error";

/** Routes reachable without a session. Everything else requires a session (default-deny). */
export const PUBLIC_PATH_PREFIXES = [LOGIN_PATH, "/auth/"] as const;

/** Must match `[auth.email] otp_length` (supabase/config.toml and Supabase Dashboard). */
export const OTP_LENGTH = 6;
/** Display-only: Supabase enforces `max_frequency` (60 s) server-side. */
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

/** Must match the CHECK constraint on `profiles.display_name`. */
export const DISPLAY_NAME_MAX_LENGTH = 60;
