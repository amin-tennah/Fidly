"use server";

import { fetchScanLogPage } from "@/features/logs/queries/fetch-scan-log-page";
import { loadScanLogsSchema, type LoadScanLogsInput } from "@/features/logs/schemas";
import type { ScanLogPage } from "@/features/logs/types";
import { authorizeRestaurantStaff } from "@/features/restaurants/server";
import { type ActionResult, err, ok } from "@/lib/errors";

/** Next page of the journal, or the fresh first page when `cursor` is null. */
export async function loadScanLogs(
  input: LoadScanLogsInput,
): Promise<ActionResult<ScanLogPage>> {
  const guard = await authorizeRestaurantStaff(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = loadScanLogsSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR");
  }

  try {
    const { restaurantId, cursor } = parsed.data;
    return ok(await fetchScanLogPage(guard.data, restaurantId, cursor));
  } catch (error) {
    console.error("loadScanLogs failed", error);
    return err("INTERNAL_ERROR");
  }
}
