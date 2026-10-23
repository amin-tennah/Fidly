"use client";

/* eslint-disable react-hooks/refs -- `useSortable` returns a ref callback and plain event
   handlers; the rule reports them as ref reads during render (known false positive). */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EyeOff, GripVertical, Pencil } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { ProgramsBoard } from "@/features/programs/hooks/use-programs-board";
import type { ProgramView } from "@/features/programs/types";
import { cn } from "@/lib/utils";
import { ProgramForm } from "./program-form";

export interface ProgramRowProps {
  readonly program: ProgramView;
  readonly board: ProgramsBoard;
}

interface SummaryProps extends ProgramRowProps {
  readonly dragProps: HTMLAttributes<HTMLButtonElement>;
}

function RowActions({ program, board }: ProgramRowProps): ReactNode {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Modifier le palier ${program.position}`}
        onClick={() => board.startEdit(program.id)}
      >
        <Pencil className="size-4" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Désactiver le palier ${program.position}`}
        disabled={board.isPending}
        onClick={() => board.toggleActive(program.id, false)}
      >
        <EyeOff className="size-4" aria-hidden="true" />
      </Button>
    </>
  );
}

function ProgramSummary({ program, board, dragProps }: SummaryProps): ReactNode {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="touch-none"
        aria-label={`Déplacer le palier ${program.position}`}
        {...dragProps}
      >
        <GripVertical className="size-5" aria-hidden="true" />
      </Button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{program.rewardLabel}</p>
        <p className="text-muted-foreground text-xs">
          Palier {program.position} · {program.threshold} passages
        </p>
      </div>
      <RowActions program={program} board={board} />
    </div>
  );
}

export function ProgramRow({ program, board }: ProgramRowProps): ReactNode {
  const sortable = useSortable({ id: program.id, disabled: board.isPending });
  const dragStyle = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <li
      ref={sortable.setNodeRef}
      style={dragStyle}
      className={cn("bg-card py-3", sortable.isDragging && "relative z-10 shadow-lg")}
    >
      {board.editingId === program.id ? (
        <ProgramForm
          initialValues={{
            threshold: program.threshold,
            rewardLabel: program.rewardLabel,
          }}
          submitLabel="Enregistrer"
          isPending={board.isPending}
          onSubmit={(values) => board.submitUpdate(program.id, values)}
          onCancel={board.cancel}
        />
      ) : (
        <ProgramSummary
          program={program}
          board={board}
          dragProps={{ ...sortable.attributes, ...sortable.listeners }}
        />
      )}
    </li>
  );
}
