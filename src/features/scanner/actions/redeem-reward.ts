"use server";

import { authorizeRestaurantStaff } from "@/features/restaurants/server";
import { toScanResult } from "@/features/scanner/actions/to-scan-result";
import { redeemRewardSchema, type RedeemRewardInput } from "@/features/scanner/schemas";
import type { ScanOutcome } from "@/features/scanner/types";
import { type ActionResult, err } from "@/lib/errors";

/** Redeems the current tier's reward (Step 6.6, ADR-009). */
export async function redeemReward(
  input: RedeemRewardInput,
): Promise<ActionResult<ScanOutcome>> {
  const guard = await authorizeRestaurantStaff(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = redeemRewardSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR");
  }

  const { data, error } = await guard.data.rpc("redeem_reward", {
    p_restaurant_id: parsed.data.restaurantId,
    p_card_id: parsed.data.cardId,
    p_idempotency_key: parsed.data.idempotencyKey,
  });
  return toScanResult(data, error);
}
