"use server";

import { authorizeRestaurantStaff } from "@/features/scanner/actions/staff-guard";
import { toScanResult } from "@/features/scanner/actions/to-scan-result";
import { reverseScanSchema, type ReverseScanInput } from "@/features/scanner/schemas";
import type { ScanOutcome } from "@/features/scanner/types";
import { type ActionResult, err } from "@/lib/errors";

/** Cancels a scan by compensating entry (Step 6.8, ADR-010). Rights are checked by the RPC. */
export async function reverseScan(
  input: ReverseScanInput,
): Promise<ActionResult<ScanOutcome>> {
  const guard = await authorizeRestaurantStaff(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = reverseScanSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR");
  }

  const { data, error } = await guard.data.rpc("reverse_scan", {
    p_restaurant_id: parsed.data.restaurantId,
    p_log_id: parsed.data.logId,
    p_idempotency_key: parsed.data.idempotencyKey,
  });
  return toScanResult(data, error);
}
