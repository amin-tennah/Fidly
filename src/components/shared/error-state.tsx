import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  readonly title: string;
  readonly description?: string;
  readonly onRetry: () => void;
}

const DEFAULT_DESCRIPTION =
  "Un souci est survenu de notre côté. Réessaie dans un instant.";

/** Full-screen error with a retry action, used by the route `error.tsx` files. */
export function ErrorState({
  title,
  description = DEFAULT_DESCRIPTION,
  onRetry,
}: ErrorStateProps): ReactNode {
  return (
    <main className="pt-safe-8 pb-safe-8 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-5 px-4 text-center">
      <span className="bg-secondary text-primary flex size-16 items-center justify-center rounded-full">
        <TriangleAlert className="size-8" aria-hidden="true" />
      </span>
      <h1 className="font-display text-xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
      <Button type="button" size="lg" onClick={onRetry}>
        Réessayer
      </Button>
    </main>
  );
}
