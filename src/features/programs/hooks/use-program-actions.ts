"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  createProgram,
  reorderPrograms,
  setProgramActive,
  updateProgram,
} from "@/features/programs/actions/program-actions";
import type { ProgramFieldsInput } from "@/features/programs/schemas";
import type { ActionResult } from "@/lib/errors";

export interface ProgramActions {
  readonly isPending: boolean;
  readonly create: (values: ProgramFieldsInput, onDone: () => void) => void;
  readonly update: (id: string, values: ProgramFieldsInput, onDone: () => void) => void;
  readonly setActive: (id: string, isActive: boolean) => void;
  readonly reorder: (ids: readonly string[], onFailure: () => void) => void;
}

type RunAction = (
  task: () => Promise<ActionResult<null>>,
  success: string,
  onResult?: (isOk: boolean) => void,
) => void;

function useRunAction(): { readonly isPending: boolean; readonly run: RunAction } {
  const [isPending, startTransition] = useTransition();

  const run: RunAction = (task, success, onResult) => {
    startTransition(async () => {
      const res = await task();
      if (res.ok) {
        toast.success(success);
      } else {
        toast.error(res.error.message);
      }
      onResult?.(res.ok);
    });
  };

  return { isPending, run };
}

/** Runs the Server Actions of the tiers with a pending state and a toast per outcome. */
export function useProgramActions(restaurantId: string): ProgramActions {
  const { isPending, run } = useRunAction();
  const onSuccess = (callback: () => void) => (isOk: boolean) => {
    if (isOk) callback();
  };
  const onFailure = (callback: () => void) => (isOk: boolean) => {
    if (!isOk) callback();
  };

  return {
    isPending,
    create: (values, onDone) =>
      run(
        () => createProgram({ restaurantId, ...values }),
        "Palier ajouté.",
        onSuccess(onDone),
      ),
    update: (programId, values, onDone) =>
      run(
        () => updateProgram({ restaurantId, programId, ...values }),
        "Palier modifié.",
        onSuccess(onDone),
      ),
    setActive: (programId, isActive) =>
      run(
        () => setProgramActive({ restaurantId, programId, isActive }),
        isActive ? "Palier réactivé." : "Palier désactivé.",
      ),
    reorder: (ids, onRevert) =>
      run(
        () => reorderPrograms({ restaurantId, programIds: [...ids] }),
        "Ordre enregistré.",
        onFailure(onRevert),
      ),
  };
}
