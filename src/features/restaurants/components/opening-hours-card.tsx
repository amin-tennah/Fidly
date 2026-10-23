"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DAY_KEYS } from "@/features/restaurants/constants";
import { useOpeningHoursEditor } from "@/features/restaurants/hooks/use-opening-hours-editor";
import type { OpeningHours } from "@/features/restaurants/types";
import { OpeningHoursDayRow } from "./opening-hours-day-row";

export interface OpeningHoursCardProps {
  readonly restaurantId: string;
  readonly initialHours: OpeningHours;
}

export function OpeningHoursCard({
  restaurantId,
  initialHours,
}: OpeningHoursCardProps): ReactNode {
  const editor = useOpeningHoursEditor(restaurantId, initialHours);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Horaires d&apos;ouverture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="divide-border divide-y">
          {DAY_KEYS.map((day) => (
            <OpeningHoursDayRow key={day} day={day} editor={editor} />
          ))}
        </ul>
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={editor.isPending}
          onClick={editor.save}
        >
          {editor.isPending ? "Enregistrement…" : "Enregistrer les horaires"}
        </Button>
      </CardContent>
    </Card>
  );
}
