import type { ScanLogEntry } from "@/features/logs/types";

/**
 * Merges a fresh first page into the list already on screen. `fresh` is the complete
 * head of the journal, so every loaded entry it does not contain is older: the loaded
 * older pages are kept, and entries present in both take the fresh version (a log
 * that was just reversed gets its « annulé » state).
 */
export function mergeHeadEntries(
  current: readonly ScanLogEntry[],
  fresh: readonly ScanLogEntry[],
): readonly ScanLogEntry[] {
  const freshIds = new Set(fresh.map((entry) => entry.id));
  return [...fresh, ...current.filter((entry) => !freshIds.has(entry.id))];
}
