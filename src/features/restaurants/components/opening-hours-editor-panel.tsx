"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DAY_KEYS } from "@/features/restaurants/constants";
import { useOpeningHoursEditor } from "@/features/restaurants/hooks/use-opening-hours-editor";
import type { OpeningHours } from "@/features/restaurants/types";
import { OpeningHoursDayRow } from "./opening-hours-day-row";

export interface OpeningHoursEditorPanelProps {
  readonly restaurantId: string;
  readonly initialHours: OpeningHours;
  readonly onClose: () => void;
}

/** The weekly hours editor: days, slots, save (closes on success) or cancel. */
export function OpeningHoursEditorPanel({
  restaurantId,
  initialHours,
  onClose,
}: OpeningHoursEditorPanelProps): ReactNode {
  const editor = useOpeningHoursEditor(restaurantId, initialHours, onClose);

  return (
    <div className="space-y-3">
      <ul className="divide-border divide-y">
        {DAY_KEYS.map((day) => (
          <OpeningHoursDayRow key={day} day={day} editor={editor} />
        ))}
      </ul>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button
          type="button"
          size="lg"
          className="flex-1"
          disabled={editor.isPending}
          onClick={editor.save}
        >
          {editor.isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
