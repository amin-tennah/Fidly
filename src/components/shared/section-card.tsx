import { Pencil, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface SectionCardProps {
  readonly title: string;
  /** `null` hides the edit control (read-only view). */
  readonly isEditing: boolean | null;
  readonly onToggleEdit: () => void;
  readonly children: ReactNode;
}

/**
 * A titled card with a view/edit toggle: the summary is shown by default, and the pencil
 * swaps it for the editor (the button then reads "Terminer").
 */
export function SectionCard({
  title,
  isEditing,
  onToggleEdit,
  children,
}: SectionCardProps): ReactNode {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{title}</h2>
        {isEditing === null ? null : (
          <Button type="button" variant="outline" size="sm" onClick={onToggleEdit}>
            {isEditing ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Pencil className="size-4" aria-hidden="true" />
            )}
            {isEditing ? "Terminer" : "Modifier"}
          </Button>
        )}
      </div>
      {children}
    </Card>
  );
}
