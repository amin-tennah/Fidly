import type { ReactNode } from "react";
import { PageTransition } from "@/components/shared/page-transition";
import { Skeleton } from "@/components/ui/skeleton";

/** Same blocks as the client home: forest header, QR card overlapping it, "Mes cartes". */
export default function ClientLoading(): ReactNode {
  return (
    <PageTransition>
      <main
        aria-busy="true"
        className="bg-background pb-safe-8 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6"
      >
        <div className="bg-primary pt-safe-5.5 rounded-b-screen h-[198px]" />
        <div className="-mt-14 space-y-5 px-5">
          <Skeleton className="bg-card rounded-panel h-[400px] w-full shadow-lg" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="rounded-card h-[98px] w-full" />
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
