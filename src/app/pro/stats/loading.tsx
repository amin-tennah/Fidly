import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/** Stats tab, inside the pro layout: one card. */
export default function ProStatsLoading(): ReactNode {
  return <Skeleton aria-busy="true" className="h-[218px] w-full rounded-xl" />;
}
