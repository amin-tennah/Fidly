"use client";

import { useResyncOnReturn } from "@/lib/realtime/use-resync-on-return";
import { useTableChanges } from "@/lib/realtime/use-table-changes";

/**
 * Calls `onChange` when a log of the restaurant is written (the payload has no names,
 * so the caller re-reads the head of the journal), and when the tab or the network
 * comes back. The RLS only delivers events of restaurants the user belongs to.
 */
export function useScanLogsRealtime(restaurantId: string, onChange: () => void): void {
  useTableChanges(
    {
      channel: `scan-logs:${restaurantId}`,
      table: "scan_logs",
      filter: `restaurant_id=eq.${restaurantId}`,
    },
    onChange,
  );
  useResyncOnReturn(onChange);
}
