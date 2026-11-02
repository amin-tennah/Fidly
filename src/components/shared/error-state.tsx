import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  readonly title: string;
  readonly onRetry: () => void;
}

/** Full-screen error with a retry action, used by the route `error.tsx` files. */
export function ErrorState({ title, onRetry }: ErrorStateProps): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-5 px-4 py-8 text-center">
      <span className="bg-secondary text-primary flex size-16 items-center justify-center rounded-full">
        <TriangleAlert className="size-8" aria-hidden="true" />
      </span>
      <h1 className="font-display text-xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-sm">
        Un souci est survenu de notre côté. Réessaie dans un instant.
      </p>
      <Button type="button" size="lg" onClick={onRetry}>
        Réessayer
      </Button>
    </main>
  );
}
