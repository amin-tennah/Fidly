import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export interface FormScreenSkeletonProps {
  /** Height in px of the main card of the screen being loaded. */
  readonly cardHeight: number;
}

/** Skeleton of the single-card screens (onboarding, invitation, back-office): pill, title, card. */
export function FormScreenSkeleton({ cardHeight }: FormScreenSkeletonProps): ReactNode {
  return (
    <main
      aria-busy="true"
      className="pt-safe-8 pb-safe-8 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5"
    >
      <div className="space-y-3">
        <Skeleton className="bg-gain/60 h-7 w-44 rounded-full" />
        <Skeleton className="h-8 w-64" />
      </div>
      <Skeleton className="w-full rounded-xl" style={{ height: cardHeight }} />
    </main>
  );
}
