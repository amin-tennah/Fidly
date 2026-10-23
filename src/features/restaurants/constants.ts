/** Cookie remembering which restaurant the pro space is currently showing. */
export const ACTIVE_RESTAURANT_COOKIE = "fidly-active-restaurant";
/** One year, in seconds. */
export const ACTIVE_RESTAURANT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const PRO_SCANNER_PATH = "/pro";
export const PRO_LOGS_PATH = "/pro/logs";
export const PRO_STATS_PATH = "/pro/stats";
export const PRO_SETTINGS_PATH = "/pro/settings";

export const PRO_NAV_ITEMS = [
  { href: PRO_SCANNER_PATH, label: "Scanner", icon: "scanner" },
  { href: PRO_LOGS_PATH, label: "Logs", icon: "logs" },
  { href: PRO_STATS_PATH, label: "Stats", icon: "stats" },
  { href: PRO_SETTINGS_PATH, label: "Réglages", icon: "settings" },
] as const;
