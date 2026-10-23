import type { ReactNode } from "react";
import { DAY_KEYS, DAY_LABELS } from "@/features/restaurants/constants";
import { formatDay } from "@/features/restaurants/domain/format-opening-hours";
import type { DayKey, OpeningHours } from "@/features/restaurants/types";
import { cn } from "@/lib/utils";

export interface OpeningHoursSummaryProps {
  readonly hours: OpeningHours;
  /** Highlighted row; `null` when unknown. */
  readonly todayKey: DayKey | null;
}

/** Read-only week at a glance; closed days are muted, today is highlighted. */
export function OpeningHoursSummary({
  hours,
  todayKey,
}: OpeningHoursSummaryProps): ReactNode {
  return (
    <ul className="divide-border divide-y text-sm">
      {DAY_KEYS.map((day) => {
        const text = formatDay(hours[day]);
        const isToday = day === todayKey;
        return (
          <li
            key={day}
            aria-current={isToday ? "date" : undefined}
            className={cn("flex justify-between gap-3 py-2", isToday && "font-semibold")}
          >
            <span className={cn(isToday && "text-accent")}>{DAY_LABELS[day]}</span>
            <span
              className={cn("text-right", text === "Fermé" && "text-muted-foreground")}
            >
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
