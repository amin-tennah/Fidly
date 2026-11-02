import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientLoading(): ReactNode {
  return (
    <main
      aria-busy="true"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 pb-8"
    >
      <Skeleton className="h-36 w-full rounded-t-none rounded-b-[28px]" />
      <div className="space-y-6 px-4">
        <Skeleton className="h-80 w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
