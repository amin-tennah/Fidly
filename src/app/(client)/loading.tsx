import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientLoading(): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-4 py-8">
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="my-6 h-72 w-full rounded-xl" />
      <Skeleton className="mx-auto h-4 w-40" />
    </main>
  );
}
