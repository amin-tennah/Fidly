import {
  DEFAULT_FIRST_SLOT,
  DEFAULT_NEXT_SLOT,
  MAX_SLOTS_PER_DAY,
} from "@/features/restaurants/constants";
import type { DayKey, OpeningHours, TimeSlot } from "@/features/restaurants/types";

function withoutDay(hours: OpeningHours, day: DayKey): OpeningHours {
  return Object.fromEntries(Object.entries(hours).filter(([key]) => key !== day));
}

/** Adds a slot to a day; the first one is the lunch default, the next ones the evening default. */
export function addSlot(hours: OpeningHours, day: DayKey): OpeningHours {
  const slots = hours[day] ?? [];
  if (slots.length >= MAX_SLOTS_PER_DAY) {
    return hours;
  }
  const next = slots.length === 0 ? DEFAULT_FIRST_SLOT : DEFAULT_NEXT_SLOT;
  return { ...hours, [day]: [...slots, next] };
}

/** Removes a slot; a day left without slot is dropped (closed). */
export function removeSlot(
  hours: OpeningHours,
  day: DayKey,
  index: number,
): OpeningHours {
  const slots = (hours[day] ?? []).filter((_, i) => i !== index);
  return slots.length === 0 ? withoutDay(hours, day) : { ...hours, [day]: slots };
}

export function updateSlot(
  hours: OpeningHours,
  day: DayKey,
  index: number,
  patch: Partial<TimeSlot>,
): OpeningHours {
  const slots = (hours[day] ?? []).map((slot, i) =>
    i === index ? { ...slot, ...patch } : slot,
  );
  return { ...hours, [day]: slots };
}

export function closeDay(hours: OpeningHours, day: DayKey): OpeningHours {
  return withoutDay(hours, day);
}
