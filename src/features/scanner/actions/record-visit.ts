"use server";

import { authorizeRestaurantStaff } from "@/features/restaurants/server";
import { toScanResult } from "@/features/scanner/actions/to-scan-result";
import { recordVisitSchema, type RecordVisitInput } from "@/features/scanner/schemas";
import type { ScanOutcome } from "@/features/scanner/types";
import { type ActionResult, err } from "@/lib/errors";

/** Credits +1 visit (Step 6.5). The cooldown is enforced by the RPC, not here. */
export async function recordVisit(
  input: RecordVisitInput,
): Promise<ActionResult<ScanOutcome>> {
  const guard = await authorizeRestaurantStaff(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = recordVisitSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR");
  }

  const { data, error } = await guard.data.rpc("record_visit", {
    p_restaurant_id: parsed.data.restaurantId,
    p_customer_id: parsed.data.customerId,
    p_idempotency_key: parsed.data.idempotencyKey,
    p_force_cooldown: parsed.data.forceCooldown,
  });
  return toScanResult(data, error);
}
