"use client";

import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MAX_ACTIVE_PROGRAMS } from "@/features/programs/constants";
import {
  useProgramsBoard,
  type ProgramsBoard,
} from "@/features/programs/hooks/use-programs-board";
import type { ProgramView } from "@/features/programs/types";
import { InactivePrograms } from "./inactive-programs";
import { ProgramForm } from "./program-form";
import { SortableProgramList } from "./sortable-program-list";

export interface ProgramsCardProps {
  readonly restaurantId: string;
  readonly programs: readonly ProgramView[];
}

function AddProgram({ board }: { readonly board: ProgramsBoard }): ReactNode {
  if (board.isAdding) {
    return (
      <ProgramForm
        initialValues={{ threshold: board.suggestedThreshold, rewardLabel: "" }}
        submitLabel="Ajouter"
        isPending={board.isPending}
        onSubmit={board.submitCreate}
        onCancel={board.cancel}
      />
    );
  }
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      disabled={!board.canAdd || board.isPending}
      onClick={board.startAdd}
    >
      <Plus className="size-4" aria-hidden="true" />
      {board.canAdd
        ? "Ajouter un palier"
        : `${MAX_ACTIVE_PROGRAMS} paliers actifs maximum`}
    </Button>
  );
}

export function ProgramsCard({ restaurantId, programs }: ProgramsCardProps): ReactNode {
  const board = useProgramsBoard(restaurantId, programs);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Programmes de fidélité</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-xs">
          Les seuils s&apos;additionnent d&apos;un palier à l&apos;autre (10, puis 20,
          puis 30). Glissez un palier pour changer l&apos;ordre : les seuils restent sur
          leur place.
        </p>
        {board.active.length === 0 ? (
          <p className="text-sm">Aucun palier actif. Créez votre première récompense.</p>
        ) : (
          <SortableProgramList board={board} />
        )}
        <AddProgram board={board} />
        <InactivePrograms board={board} />
      </CardContent>
    </Card>
  );
}
