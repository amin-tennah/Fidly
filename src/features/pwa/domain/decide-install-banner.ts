export type InstallBannerMode = "hidden" | "prompt" | "ios-guide";

export interface InstallBannerInput {
  /** Already running as an installed app, or installed during this visit. */
  readonly isInstalled: boolean;
  /** The customer has at least one card, i.e. a first visit was credited. */
  readonly hasFirstVisit: boolean;
  readonly isDismissed: boolean;
  /** The browser handed over an install prompt (Android Chrome). */
  readonly canPrompt: boolean;
  readonly isIos: boolean;
}

/**
 * Which install banner to show (roadmap 8.3): never to an installed app, to someone who
 * declined, or before a first credited visit; the native prompt where the browser offers
 * one, the manual steps on iOS, nothing elsewhere.
 */
export function decideInstallBanner(input: InstallBannerInput): InstallBannerMode {
  if (input.isInstalled || input.isDismissed || !input.hasFirstVisit) {
    return "hidden";
  }
  if (input.canPrompt) {
    return "prompt";
  }
  return input.isIos ? "ios-guide" : "hidden";
}
