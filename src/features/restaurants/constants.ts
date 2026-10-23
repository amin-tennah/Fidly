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

/** Must match the CHECK constraint on `restaurants.name`. */
export const RESTAURANT_NAME_MAX_LENGTH = 120;
/** Must match `restaurants_address_length_chk`. */
export const ADDRESS_MAX_LENGTH = 200;

/** Mirrors the `restaurant_category` enum (checked by the compiler against the DB types). */
export const RESTAURANT_CATEGORY_VALUES = [
  "fast_food",
  "burger",
  "tacos",
  "pizza",
  "asian",
  "bakery",
  "coffee_shop",
  "other",
] as const;

export const RESTAURANT_CATEGORY_LABELS: Record<
  (typeof RESTAURANT_CATEGORY_VALUES)[number],
  string
> = {
  fast_food: "Restauration rapide",
  burger: "Burger",
  tacos: "Tacos",
  pizza: "Pizza",
  asian: "Asiatique",
  bakery: "Boulangerie",
  coffee_shop: "Café",
  other: "Autre",
};

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export const DAY_LABELS = {
  mon: "Lundi",
  tue: "Mardi",
  wed: "Mercredi",
  thu: "Jeudi",
  fri: "Vendredi",
  sat: "Samedi",
  sun: "Dimanche",
} as const;

export const MAX_SLOTS_PER_DAY = 3;
export const MINUTES_PER_DAY = 24 * 60;
/** Slot proposed when a day is opened, then when a slot is added. */
export const DEFAULT_FIRST_SLOT = { open: "11:30", close: "14:30" } as const;
export const DEFAULT_NEXT_SLOT = { open: "19:00", close: "22:30" } as const;

/** Geocoding service (IGN Géoplateforme, successor of api-adresse.data.gouv.fr — ADR-007). */
export const ADDRESS_SEARCH_URL = "https://data.geopf.fr/geocodage/search";
export const ADDRESS_SEARCH_LIMIT = 5;
export const ADDRESS_SEARCH_MIN_CHARS = 3;
export const ADDRESS_SEARCH_DEBOUNCE_MS = 300;
/** Geocoding responses are cached server-side for one hour. */
export const ADDRESS_SEARCH_CACHE_SECONDS = 3600;
