import { RESTAURANT_TIME_ZONE } from "@/lib/restaurant-fields";

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: RESTAURANT_TIME_ZONE,
});

/** `06/11/2026`, in the restaurants' time zone (the same text on the server and in the browser). */
export function formatShortDate(iso: string): string {
  return DATE_FORMAT.format(new Date(iso));
}
