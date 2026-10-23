/** Constants mirroring the `restaurants` table, shared by the restaurants and admin features. */

/** Must match the CHECK constraint on `restaurants.name`. */
export const RESTAURANT_NAME_MAX_LENGTH = 120;

/** Restaurants are French: dates and opening hours are read in this time zone. */
export const RESTAURANT_TIME_ZONE = "Europe/Paris";

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
