import { z } from "zod";
import { SCAN_LOGS_PAGE_SIZE } from "@/features/logs/constants";
import type { ScanLogEntry, ScanLogPage } from "@/features/logs/types";

const uuid = z.string().uuid();
const isoDate = z.string().datetime({ offset: true });

export const loadScanLogsSchema = z.object({
  restaurantId: uuid,
  cursor: z.object({ createdAt: isoDate, id: uuid }).nullable(),
});

export type LoadScanLogsInput = z.infer<typeof loadScanLogsSchema>;

const logRowSchema = z
  .object({
    log_id: uuid,
    created_at: isoDate,
    type: z.enum(["visit", "reward_redeemed"]),
    cooldown_overridden: z.boolean(),
    reward_label: z.string(),
    customer_name: z.string().nullable(),
    staff_name: z.string().nullable(),
    is_reversed: z.boolean(),
    reversed_at: isoDate.nullable(),
    reversed_by_name: z.string().nullable(),
  })
  .transform((row): ScanLogEntry => ({
    id: row.log_id,
    createdAt: row.created_at,
    type: row.type,
    rewardLabel: row.reward_label,
    customerName: row.customer_name,
    staffName: row.staff_name,
    isCooldownOverridden: row.cooldown_overridden,
    isReversed: row.is_reversed,
    reversedAt: row.reversed_at,
    reversedByName: row.reversed_by_name,
  }));

/** Validates the rows of `list_scan_logs` (one extra row = older logs exist). */
export function parseScanLogRows(rows: unknown): ScanLogPage | null {
  const parsed = z.array(logRowSchema).safeParse(rows);
  if (!parsed.success) {
    return null;
  }
  return {
    entries: parsed.data.slice(0, SCAN_LOGS_PAGE_SIZE),
    hasMore: parsed.data.length > SCAN_LOGS_PAGE_SIZE,
  };
}
