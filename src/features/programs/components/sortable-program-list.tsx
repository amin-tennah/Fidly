"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import type { ProgramsBoard } from "@/features/programs/hooks/use-programs-board";
import { ProgramRow } from "./program-row";

const DRAG_START_DISTANCE_PX = 6;

export function SortableProgramList({
  board,
}: {
  readonly board: ProgramsBoard;
}): ReactNode {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: DRAG_START_DISTANCE_PX },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const ids = board.active.map((p) => p.id);

  const handleDragEnd = ({ active, over }: DragEndEvent): void => {
    if (!over || active.id === over.id) {
      return;
    }
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from >= 0 && to >= 0) {
      board.reorder(arrayMove(ids, from, to));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className="divide-border divide-y">
          {board.active.map((program) => (
            <ProgramRow key={program.id} program={program} board={board} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
