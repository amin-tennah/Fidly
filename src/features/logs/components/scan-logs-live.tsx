"use client";

import type { ReactNode } from "react";
import { ScanLogRow } from "@/features/logs/components/scan-log-row";
import { ScanLogsFooter } from "@/features/logs/components/scan-logs-footer";
import { useScanLogs } from "@/features/logs/hooks/use-scan-logs";
import type { ScanLogPage } from "@/features/logs/types";

interface ScanLogsLiveProps {
  readonly restaurantId: string;
  readonly initialPage: ScanLogPage;
}

export function ScanLogsLive({
  restaurantId,
  initialPage,
}: ScanLogsLiveProps): ReactNode {
  const logs = useScanLogs(restaurantId, initialPage);

  if (logs.entries.length === 0) {
    return (
      <p role="status" className="text-muted-foreground text-sm">
        Aucun scan pour le moment. Les passages validés apparaîtront ici en direct.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {logs.entries.map((entry) => (
          <ScanLogRow key={entry.id} entry={entry} />
        ))}
      </ul>
      <ScanLogsFooter
        hasMore={logs.hasMore}
        isLoadingMore={logs.isLoadingMore}
        error={logs.error}
        onLoadMore={logs.loadMore}
      />
    </div>
  );
}
