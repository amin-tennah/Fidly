import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientLoading(): ReactNode {
  return (
    <main
      aria-busy="true"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 py-8"
    >
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-80 w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    </main>
  );
}
