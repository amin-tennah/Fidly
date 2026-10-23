import { RESTAURANT_TIME_ZONE } from "@/features/restaurants/constants";
import { crossesMidnight } from "@/features/restaurants/domain/opening-hours";
import type { DayKey, TimeSlot } from "@/features/restaurants/types";

const WEEKDAY_TO_KEY: Readonly<Record<string, DayKey>> = {
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
  Sun: "sun",
};

/** `11:30 – 14:30`, with `(lendemain)` when the slot closes after midnight. */
export function formatSlot(slot: TimeSlot): string {
  const range = `${slot.open} – ${slot.close}`;
  return crossesMidnight(slot) ? `${range} (lendemain)` : range;
}

/** Slots of one day, in opening order, separated by ` · `; `Fermé` when there is none. */
export function formatDay(slots: readonly TimeSlot[] | undefined): string {
  if (!slots || slots.length === 0) {
    return "Fermé";
  }
  return [...slots]
    .sort((a, b) => a.open.localeCompare(b.open))
    .map(formatSlot)
    .join(" · ");
}

/** The weekday of `now` in the restaurants' time zone (not the server's or the browser's). */
export function todayDayKey(
  now: Date,
  timeZone: string = RESTAURANT_TIME_ZONE,
): DayKey | null {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone }).format(
    now,
  );
  return WEEKDAY_TO_KEY[weekday] ?? null;
}
