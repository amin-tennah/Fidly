import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/** Scanner tab, inside the pro layout (header and tab bar stay): hero action and code block. */
export default function ProLoading(): ReactNode {
  return (
    <div aria-busy="true" className="space-y-4">
      <Skeleton className="bg-primary/85 h-[150px] w-full rounded-[28px]" />
      <Skeleton className="h-[120px] w-full rounded-[20px]" />
    </div>
  );
}
