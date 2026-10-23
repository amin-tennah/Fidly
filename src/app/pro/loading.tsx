import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProLoading(): ReactNode {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 py-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-44 w-full rounded-xl" />
    </div>
  );
}
