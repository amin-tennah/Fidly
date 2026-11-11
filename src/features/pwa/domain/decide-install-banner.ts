export type InstallBannerMode = "hidden" | "prompt" | "ios-guide" | "android-guide";

export interface InstallBannerInput {
  /** Already running as an installed app, or installed during this visit. */
  readonly isInstalled: boolean;
  /** The customer has at least one card, i.e. a first visit was credited. */
  readonly hasFirstVisit: boolean;
  /** Closed for this browser session only (never remembered for good). */
  readonly isDismissed: boolean;
  /** The browser handed over an install prompt (Android Chrome). */
  readonly canPrompt: boolean;
  readonly isIos: boolean;
  readonly isAndroid: boolean;
}

/**
 * Which install banner to show (roadmap 8.3): never to an installed app, to someone who
 * closed it this session, or before a first credited visit; the native prompt where the
 * browser offers one, otherwise the manual steps on iOS and on Android (Chrome may withhold
 * its prompt, e.g. for a while after an uninstall), nothing elsewhere.
 */
export function decideInstallBanner(input: InstallBannerInput): InstallBannerMode {
  if (input.isInstalled || input.isDismissed || !input.hasFirstVisit) {
    return "hidden";
  }
  if (input.canPrompt) {
    return "prompt";
  }
  if (input.isIos) {
    return "ios-guide";
  }
  return input.isAndroid ? "android-guide" : "hidden";
}
