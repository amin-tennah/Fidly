import type { Enums } from "@/types/database.types";
import type { DAY_KEYS } from "@/features/restaurants/constants";

export type RestaurantCategory = Enums<"restaurant_category">;
export type DayKey = (typeof DAY_KEYS)[number];

/** `HH:MM`, 24 h. A `close` earlier than `open` means closing after midnight. */
export interface TimeSlot {
  readonly open: string;
  readonly close: string;
}

/** Days without an entry (or with no slot) are closed. */
export type OpeningHours = Partial<Record<DayKey, TimeSlot[]>>;

export interface RestaurantProfile {
  readonly id: string;
  readonly name: string;
  readonly category: RestaurantCategory;
  readonly address: string | null;
  readonly openingHours: OpeningHours;
  readonly logoUrl: string | null;
  readonly coverUrl: string | null;
}

export interface AddressSuggestion {
  readonly label: string;
  readonly lng: number;
  readonly lat: number;
}
