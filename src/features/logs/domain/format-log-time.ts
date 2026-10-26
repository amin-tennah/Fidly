import { RESTAURANT_TIME_ZONE } from "@/lib/restaurant-fields";

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: RESTAURANT_TIME_ZONE,
});

const TIME_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: RESTAURANT_TIME_ZONE,
});

/** `2026-07-14T10:05:00+00:00` → `14 juil. · 12:05` (restaurant time zone, not the phone's). */
export function formatLogTime(isoDate: string): string {
  const date = new Date(isoDate);
  return `${DATE_FORMAT.format(date)} · ${TIME_FORMAT.format(date)}`;
}
