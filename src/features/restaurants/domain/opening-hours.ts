import { MINUTES_PER_DAY } from "@/features/restaurants/constants";
import type { TimeSlot } from "@/features/restaurants/types";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidTime(value: string): boolean {
  return TIME_PATTERN.test(value);
}

export function toMinutes(time: string): number {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

/** End of a slot in minutes from the day start; past `MINUTES_PER_DAY` when it crosses midnight. */
function endMinutes(slot: TimeSlot): number {
  const open = toMinutes(slot.open);
  const close = toMinutes(slot.close);
  return close > open ? close : close + MINUTES_PER_DAY;
}

/**
 * Checks the slots of one day: valid times, non-empty slots, no overlap.
 * Returns a French error message, or `null` when the day is valid.
 */
export function validateDaySlots(slots: readonly TimeSlot[]): string | null {
  const sorted = [...slots].sort((a, b) => toMinutes(a.open) - toMinutes(b.open));
  for (const slot of sorted) {
    if (slot.open === slot.close) {
      return "L'ouverture et la fermeture doivent être différentes.";
    }
  }
  for (let i = 1; i < sorted.length; i += 1) {
    const previous = sorted[i - 1];
    const current = sorted[i];
    if (previous && current && endMinutes(previous) > toMinutes(current.open)) {
      return "Les créneaux d'une même journée ne doivent pas se chevaucher.";
    }
  }
  return null;
}
