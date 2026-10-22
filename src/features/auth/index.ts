export {
  ADMIN_HOME_PATH,
  AUTH_CALLBACK_PATH,
  CLIENT_HOME_PATH,
  DISPLAY_NAME_MAX_LENGTH,
  INVITATION_PATH,
  LOGIN_ERROR_PARAM,
  LOGIN_PATH,
  NEXT_PARAM,
  ONBOARDING_PATH,
  OTP_LENGTH,
  OTP_RESEND_COOLDOWN_SECONDS,
  PRO_HOME_PATH,
  PUBLIC_PATH_PREFIXES,
} from "./constants";

export type {
  PendingRestaurantInvitation,
  RestaurantMemberRole,
  RestaurantMembershipSummary,
  UserProfileSummary,
} from "./types";

export {
  acceptInvitationSchema,
  sendEmailOtpSchema,
  updateDisplayNameSchema,
  verifyEmailOtpSchema,
} from "./schemas";
export type {
  AcceptInvitationInput,
  SendEmailOtpInput,
  UpdateDisplayNameInput,
  VerifyEmailOtpInput,
} from "./schemas";

export {
  buildLoginPath,
  isPublicPath,
  sanitizeNextPath,
  withNextParam,
} from "./domain/redirects";
export { mapAuthErrorCode } from "./domain/map-auth-error";

export { sendEmailOtp, verifyEmailOtp } from "./actions/otp-actions";
export {
  acceptRestaurantInvitation,
  signOutUser,
  updateDisplayName,
} from "./actions/profile-and-invitation-actions";

export { GoogleSignInButton } from "./components/google-sign-in-button";
export { InvitationAcceptCard } from "./components/invitation-accept-card";
export { OnboardingNameForm } from "./components/onboarding-name-form";
export { OtpLoginForm } from "./components/otp-login-form";
export { ProAccessBanners } from "./components/pro-access-banners";
export { SignOutButton } from "./components/sign-out-button";

export { usePersistIdentity } from "./hooks/use-persist-identity";
export type { StoredIdentity } from "./identity-storage";
