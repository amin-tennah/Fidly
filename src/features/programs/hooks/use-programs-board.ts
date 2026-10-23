"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MAX_ACTIVE_PROGRAMS } from "@/features/programs/constants";
import {
  describeViolation,
  findRuleViolation,
  listActivePrograms,
  previewCreate,
  previewReorder,
  previewUpdate,
  suggestNextThreshold,
} from "@/features/programs/domain/program-rules";
import { useProgramActions } from "@/features/programs/hooks/use-program-actions";
import type { ProgramFieldsInput } from "@/features/programs/schemas";
import type { ProgramView } from "@/features/programs/types";

export interface ProgramsBoard {
  readonly active: readonly ProgramView[];
  readonly inactive: readonly ProgramView[];
  readonly editingId: string | null;
  readonly isAdding: boolean;
  readonly isPending: boolean;
  readonly canAdd: boolean;
  readonly suggestedThreshold: number;
  readonly startAdd: () => void;
  readonly startEdit: (id: string) => void;
  readonly cancel: () => void;
  readonly submitCreate: (values: ProgramFieldsInput) => void;
  readonly submitUpdate: (id: string, values: ProgramFieldsInput) => void;
  readonly toggleActive: (id: string, isActive: boolean) => void;
  readonly reorder: (ids: readonly string[]) => void;
}

/** The database enforces every rule; this local check only spares a round trip. */
function refuseLocally(candidate: readonly ProgramView[]): boolean {
  const violation = findRuleViolation(candidate);
  if (violation) {
    toast.error(describeViolation(violation));
  }
  return violation !== null;
}

/** Which form is open: at most one of "adding a tier" or "editing a tier". */
function useBoardForms(): Pick<
  ProgramsBoard,
  "editingId" | "isAdding" | "startAdd" | "startEdit" | "cancel"
> {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  return {
    editingId,
    isAdding,
    startAdd: () => {
      setEditingId(null);
      setIsAdding(true);
    },
    startEdit: (id) => {
      setIsAdding(false);
      setEditingId(id);
    },
    cancel: () => {
      setEditingId(null);
      setIsAdding(false);
    },
  };
}

/**
 * State of the tiers card. Dragging shows the result at once (thresholds stay on the
 * places) and reverts if the server refuses.
 */
export function useProgramsBoard(
  restaurantId: string,
  programs: readonly ProgramView[],
): ProgramsBoard {
  const serverOrder = listActivePrograms(programs).map((p) => p.id);
  const [order, setOrder] = useState(serverOrder);
  const forms = useBoardForms();
  const actions = useProgramActions(restaurantId);
  const arranged = previewReorder(programs, order);
  const active = arranged.filter((p) => p.isActive);

  return {
    ...forms,
    active,
    inactive: arranged.filter((p) => !p.isActive),
    isPending: actions.isPending,
    canAdd: active.length < MAX_ACTIVE_PROGRAMS,
    suggestedThreshold: suggestNextThreshold(programs),
    submitCreate: (values) => {
      if (!refuseLocally(previewCreate(programs, values))) {
        actions.create(values, forms.cancel);
      }
    },
    submitUpdate: (id, values) => {
      if (!refuseLocally(previewUpdate(programs, id, values))) {
        actions.update(id, values, forms.cancel);
      }
    },
    toggleActive: actions.setActive,
    reorder: (ids) => {
      setOrder([...ids]);
      actions.reorder(ids, () => setOrder(serverOrder));
    },
  };
}
