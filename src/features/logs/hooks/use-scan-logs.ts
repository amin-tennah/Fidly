"use client";

import { useCallback, useState } from "react";
import { loadScanLogs } from "@/features/logs/actions/load-scan-logs";
import { mergeHeadEntries } from "@/features/logs/domain/merge-log-entries";
import { useScanLogsRealtime } from "@/features/logs/hooks/use-scan-logs-realtime";
import type { ScanLogEntry, ScanLogPage } from "@/features/logs/types";
import { runAction } from "@/lib/run-action";

export interface ScanLogsView {
  readonly entries: readonly ScanLogEntry[];
  readonly hasMore: boolean;
  readonly isLoadingMore: boolean;
  readonly error: string | null;
  readonly loadMore: () => void;
}

/** Journal state: server-rendered first page, older pages on demand, live head. */
export function useScanLogs(
  restaurantId: string,
  initialPage: ScanLogPage,
): ScanLogsView {
  const [entries, setEntries] = useState(initialPage.entries);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHead = useCallback((): void => {
    void runAction(() => loadScanLogs({ restaurantId, cursor: null })).then((result) => {
      if (result.ok) {
        setEntries((current) => mergeHeadEntries(current, result.data.entries));
      }
    });
  }, [restaurantId]);

  const last = entries.at(-1);
  const loadMore = useCallback((): void => {
    if (!last || isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    setError(null);
    const cursor = { createdAt: last.createdAt, id: last.id };
    void runAction(() => loadScanLogs({ restaurantId, cursor })).then((result) => {
      setIsLoadingMore(false);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setEntries((current) => [...current, ...result.data.entries]);
      setHasMore(result.data.hasMore);
    });
  }, [restaurantId, last, isLoadingMore]);

  useScanLogsRealtime(restaurantId, refreshHead);

  return { entries, hasMore, isLoadingMore, error, loadMore };
}
