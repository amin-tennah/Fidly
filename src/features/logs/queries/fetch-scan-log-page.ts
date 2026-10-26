import "server-only";
import { SCAN_LOGS_PAGE_SIZE } from "@/features/logs/constants";
import { parseScanLogRows } from "@/features/logs/schemas";
import type { ScanLogCursor, ScanLogPage } from "@/features/logs/types";
import type { ServerSupabase } from "@/features/restaurants/server";

/** One page of the journal, newest first (`list_scan_logs` checks the membership). */
export async function fetchScanLogPage(
  supabase: ServerSupabase,
  restaurantId: string,
  cursor: ScanLogCursor | null,
): Promise<ScanLogPage> {
  const { data, error } = await supabase.rpc("list_scan_logs", {
    p_restaurant_id: restaurantId,
    p_before_at: cursor?.createdAt,
    p_before_id: cursor?.id,
    p_limit: SCAN_LOGS_PAGE_SIZE + 1,
  });
  if (error) {
    throw new Error(`fetchScanLogPage failed: ${error.message}`);
  }
  const page = parseScanLogRows(data);
  if (!page) {
    throw new Error("fetchScanLogPage: unexpected rows from list_scan_logs");
  }
  return page;
}
