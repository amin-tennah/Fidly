"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import type { DayKey, OpeningHours } from "@/features/restaurants/types";
import { OpeningHoursEditorPanel } from "./opening-hours-editor-panel";
import { OpeningHoursSummary } from "./opening-hours-summary";

export interface OpeningHoursSectionProps {
  readonly restaurantId: string;
  readonly hours: OpeningHours;
  readonly todayKey: DayKey | null;
  readonly canEdit: boolean;
}

/** Opening hours: a compact week by default, the full editor on demand (owner only). */
export function OpeningHoursSection({
  restaurantId,
  hours,
  todayKey,
  canEdit,
}: OpeningHoursSectionProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <SectionCard
      title="Horaires d'ouverture"
      isEditing={canEdit ? isEditing : null}
      onToggleEdit={() => setIsEditing((value) => !value)}
    >
      {isEditing ? (
        <OpeningHoursEditorPanel
          restaurantId={restaurantId}
          initialHours={hours}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <OpeningHoursSummary hours={hours} todayKey={todayKey} />
      )}
    </SectionCard>
  );
}
