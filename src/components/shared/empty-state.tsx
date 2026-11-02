import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
}

/** Empty list placeholder: icon, short title, one sentence and an optional action. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps): ReactNode {
  return (
    <div className="border-border flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 text-center">
      <span className="bg-secondary text-primary flex size-14 items-center justify-center rounded-full">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <p className="font-display text-lg font-bold">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
      {action}
    </div>
  );
}
