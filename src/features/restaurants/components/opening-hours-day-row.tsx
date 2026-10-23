import { Plus, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DAY_LABELS, MAX_SLOTS_PER_DAY } from "@/features/restaurants/constants";
import type { OpeningHoursEditor } from "@/features/restaurants/hooks/use-opening-hours-editor";
import type { DayKey, TimeSlot } from "@/features/restaurants/types";

export interface OpeningHoursDayRowProps {
  readonly day: DayKey;
  readonly editor: OpeningHoursEditor;
}

interface SlotRowProps extends OpeningHoursDayRowProps {
  readonly slot: TimeSlot;
  readonly index: number;
}

function SlotRow({ day, editor, slot, index }: SlotRowProps): ReactNode {
  const label = DAY_LABELS[day];
  const position = index + 1;

  return (
    <div className="flex items-center gap-2">
      <Input
        type="time"
        aria-label={`${label} : ouverture du créneau ${position}`}
        value={slot.open}
        onChange={(e) => editor.updateSlot(day, index, { open: e.target.value })}
      />
      <span aria-hidden="true">–</span>
      <Input
        type="time"
        aria-label={`${label} : fermeture du créneau ${position}`}
        value={slot.close}
        onChange={(e) => editor.updateSlot(day, index, { close: e.target.value })}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`${label} : supprimer le créneau ${position}`}
        onClick={() => editor.removeSlot(day, index)}
      >
        <X className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

export function OpeningHoursDayRow({ day, editor }: OpeningHoursDayRowProps): ReactNode {
  const slots = editor.hours[day] ?? [];
  const isClosed = slots.length === 0;

  return (
    <li className="space-y-2 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{DAY_LABELS[day]}</span>
        <Button
          type="button"
          variant={isClosed ? "outline" : "ghost"}
          onClick={() => (isClosed ? editor.openDay(day) : editor.closeDay(day))}
        >
          {isClosed ? "Fermé · Ouvrir" : "Fermer ce jour"}
        </Button>
      </div>
      {slots.map((slot, index) => (
        <SlotRow key={index} day={day} editor={editor} slot={slot} index={index} />
      ))}
      {!isClosed && slots.length < MAX_SLOTS_PER_DAY ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.addSlot(day)}
        >
          <Plus className="size-4" aria-hidden="true" /> Ajouter un créneau
        </Button>
      ) : null}
    </li>
  );
}
