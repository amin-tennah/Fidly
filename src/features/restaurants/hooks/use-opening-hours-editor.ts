"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateOpeningHours } from "@/features/restaurants/actions/update-restaurant-profile";
import {
  addSlot,
  closeDay,
  removeSlot,
  updateSlot,
} from "@/features/restaurants/domain/edit-opening-hours";
import type { DayKey, OpeningHours, TimeSlot } from "@/features/restaurants/types";

export interface OpeningHoursEditor {
  readonly hours: OpeningHours;
  readonly isPending: boolean;
  readonly openDay: (day: DayKey) => void;
  readonly closeDay: (day: DayKey) => void;
  readonly addSlot: (day: DayKey) => void;
  readonly removeSlot: (day: DayKey, index: number) => void;
  readonly updateSlot: (day: DayKey, index: number, patch: Partial<TimeSlot>) => void;
  readonly save: () => void;
}

/** Draft of the weekly hours (pure transitions in `domain/`) and its save action. */
export function useOpeningHoursEditor(
  restaurantId: string,
  initialHours: OpeningHours,
  onSaved: () => void,
): OpeningHoursEditor {
  const [hours, setHours] = useState<OpeningHours>(initialHours);
  const [isPending, startTransition] = useTransition();

  const save = (): void => {
    startTransition(async () => {
      const res = await updateOpeningHours({ restaurantId, openingHours: hours });
      if (res.ok) {
        toast.success("Horaires enregistrés.");
        onSaved();
      } else {
        toast.error(res.error.message);
      }
    });
  };

  return {
    hours,
    isPending,
    openDay: (day) => setHours((h) => addSlot(h, day)),
    closeDay: (day) => setHours((h) => closeDay(h, day)),
    addSlot: (day) => setHours((h) => addSlot(h, day)),
    removeSlot: (day, index) => setHours((h) => removeSlot(h, day, index)),
    updateSlot: (day, index, patch) => setHours((h) => updateSlot(h, day, index, patch)),
    save,
  };
}
