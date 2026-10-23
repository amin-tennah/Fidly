"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { programsSignature } from "@/features/programs/domain/program-rules";
import type { ProgramView } from "@/features/programs/types";
import { ProgramsEditor } from "./programs-editor";
import { ProgramsSummary } from "./programs-summary";

export interface ProgramsSectionProps {
  readonly restaurantId: string;
  readonly programs: readonly ProgramView[];
  readonly canEdit: boolean;
}

/**
 * Loyalty tiers: a summary by default, the editor on demand (owner only). The editor is
 * keyed by the stored tiers so its drafts reset after each save, while this section keeps
 * the editor open between actions.
 */
export function ProgramsSection({
  restaurantId,
  programs,
  canEdit,
}: ProgramsSectionProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <SectionCard
      title="Programmes de fidélité"
      isEditing={canEdit ? isEditing : null}
      onToggleEdit={() => setIsEditing((value) => !value)}
    >
      {isEditing ? (
        <ProgramsEditor
          key={programsSignature(programs)}
          restaurantId={restaurantId}
          programs={programs}
        />
      ) : (
        <ProgramsSummary programs={programs} />
      )}
    </SectionCard>
  );
}
