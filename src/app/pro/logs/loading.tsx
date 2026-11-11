import type { ReactNode } from "react";
import { SectionTitle } from "@/components/shared/section-title";
import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_ROWS = 4;

/** Logs tab, inside the pro layout: the real heading, then placeholder rows. */
export default function ProLogsLoading(): ReactNode {
  return (
    <section aria-busy="true" aria-labelledby="logs-heading" className="space-y-3">
      <SectionTitle id="logs-heading">Journal des scans</SectionTitle>
      <div className="space-y-2">
        {Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
          <Skeleton key={index} className="rounded-block h-[76px] w-full" />
        ))}
      </div>
    </section>
  );
}
