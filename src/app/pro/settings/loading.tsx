import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/** Settings tab, inside the pro layout: restaurant card (banner on top), hours, programs. */
export default function ProSettingsLoading(): ReactNode {
  return (
    <div aria-busy="true" className="space-y-4">
      <div className="border-border overflow-hidden rounded-xl border-2">
        <Skeleton className="aspect-video w-full rounded-none" />
        <div className="space-y-3 px-5 pt-12 pb-5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      <Skeleton className="h-[420px] w-full rounded-xl" />
      <Skeleton className="h-[220px] w-full rounded-xl" />
    </div>
  );
}
