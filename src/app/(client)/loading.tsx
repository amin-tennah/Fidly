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
        <div className="bg-primary pt-safe-5.5 h-[198px] rounded-b-[28px]" />
        <div className="-mt-14 space-y-5 px-5">
          <Skeleton className="bg-card h-[400px] w-full rounded-[22px] shadow-lg" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-[98px] w-full rounded-[20px]" />
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
