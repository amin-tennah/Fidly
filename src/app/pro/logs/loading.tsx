import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_ROWS = 4;

/** Logs tab, inside the pro layout: the real heading, then placeholder rows. */
export default function ProLogsLoading(): ReactNode {
  return (
    <section aria-busy="true" aria-labelledby="logs-heading" className="space-y-3">
      <h1 id="logs-heading" className="font-display text-lg font-semibold tracking-tight">
        Journal des scans
      </h1>
      <div className="space-y-2">
        {Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
          <Skeleton key={index} className="h-[70px] w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
}
