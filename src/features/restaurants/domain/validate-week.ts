import { DAY_KEYS, DAY_LABELS } from "@/features/restaurants/constants";
import { crossesMidnight, toMinutes } from "@/features/restaurants/domain/opening-hours";
import type { DayKey, OpeningHours } from "@/features/restaurants/types";

/** Latest closing time (minutes after midnight) of the slots of `day` that run past midnight. */
function overnightTail(hours: OpeningHours, day: DayKey): number {
  const closings = (hours[day] ?? [])
    .filter(crossesMidnight)
    .map((slot) => toMinutes(slot.close));
  return Math.max(0, ...closings);
}

function earliestOpening(hours: OpeningHours, day: DayKey): number {
  const openings = (hours[day] ?? []).map((slot) => toMinutes(slot.open));
  return Math.min(Number.POSITIVE_INFINITY, ...openings);
}

/**
 * Checks the whole week: a slot closing after midnight belongs to the day it opens, so it
 * must not overlap the first slot of the following day (Sunday is followed by Monday).
 * Returns a French error message, or `null` when the week is consistent.
 */
export function validateWeek(hours: OpeningHours): string | null {
  for (const [index, day] of DAY_KEYS.entries()) {
    const nextDay = DAY_KEYS[(index + 1) % DAY_KEYS.length];
    if (nextDay && overnightTail(hours, day) > earliestOpening(hours, nextDay)) {
      return `Le créneau du ${DAY_LABELS[day].toLowerCase()} se prolonge après minuit : il chevauche celui du ${DAY_LABELS[nextDay].toLowerCase()}. Ne le ressaisissez pas le lendemain.`;
    }
  }
  return null;
}
