/** localStorage key remembering that the customer declined the install banner. */
export const INSTALL_DISMISSED_STORAGE_KEY = "rezone.install-dismissed.v1";

/** Display mode of an installed app (manifest `display: standalone`). */
export const STANDALONE_MEDIA_QUERY = "(display-mode: standalone)";

/** localStorage key remembering that the "installed" celebration was acknowledged. */
export const INSTALL_CELEBRATED_STORAGE_KEY = "rezone.install-celebrated.v1";

/** App icon with rounded corners (05-DIRECTION-ARTISTIQUE §1). */
export const APP_ICON_SRC = "/brand/icon-rezone.svg";

/** What the installed app gives: short label for the banner, sentence for the celebration. */
export const INSTALL_BENEFITS = [
  { icon: "qr", label: "Ton QR", sentence: "Ton QR, prêt en un geste" },
  { icon: "cards", label: "Tes cartes", sentence: "Tes cartes et tes tampons" },
  { icon: "shops", label: "Les commerces", sentence: "Les commerces du réseau" },
] as const;

export type InstallBenefitIcon = (typeof INSTALL_BENEFITS)[number]["icon"];

/**
 * "Installed" celebration (06-DA-ITERATION-2 §5): a mock home screen of 2 × 4 apps whose
 * empty slot receives the Rézone icon. Colours of the neighbouring apps, then the timing of
 * the three benefit rows (the keyframes and their delays live in globals.css).
 */
export const HOME_SCREEN_APP_COLORS = [
  "#D9D2C0",
  "#CBD9D0",
  "#D9CBC4",
  "#CCD3E0",
  "#DDD6B8",
  "#CFD8C4",
  "#D8CCD9",
] as const;
export const HOME_SCREEN_SLOT_INDEX = 6;
export const INSTALL_SUCCESS_FIRST_ROW_MS = 1850;
export const INSTALL_SUCCESS_ROW_STEP_MS = 200;
