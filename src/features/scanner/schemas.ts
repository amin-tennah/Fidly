import { z } from "zod";
import { SCAN_INPUT_MAX_LENGTH } from "@/features/scanner/constants";
import type { CustomerLookup, ScanOutcome } from "@/features/scanner/types";

const uuid = z.string().uuid();

export const lookupCustomerSchema = z.object({
  restaurantId: uuid,
  tokenOrCode: z.string().min(1).max(SCAN_INPUT_MAX_LENGTH),
});

export const recordVisitSchema = z.object({
  restaurantId: uuid,
  customerId: uuid,
  idempotencyKey: uuid,
  forceCooldown: z.boolean(),
});

export const redeemRewardSchema = z.object({
  restaurantId: uuid,
  cardId: uuid,
  idempotencyKey: uuid,
});

export const reverseScanSchema = z.object({
  restaurantId: uuid,
  logId: uuid,
  idempotencyKey: uuid,
});

export type LookupCustomerInput = z.infer<typeof lookupCustomerSchema>;
export type RecordVisitInput = z.infer<typeof recordVisitSchema>;
export type RedeemRewardInput = z.infer<typeof redeemRewardSchema>;
export type ReverseScanInput = z.infer<typeof reverseScanSchema>;

const lookupRowSchema = z
  .object({
    customer_id: uuid,
    display_name: z.string(),
    card_id: uuid.nullable(),
    reward_label: z.string(),
    stamps: z.number().int(),
    threshold: z.number().int(),
    is_reward_unlocked: z.boolean(),
    is_in_cooldown: z.boolean(),
    cooldown_remaining_seconds: z.number().int(),
  })
  .transform((row): CustomerLookup => ({
    customerId: row.customer_id,
    displayName: row.display_name,
    cardId: row.card_id,
    rewardLabel: row.reward_label,
    stamps: row.stamps,
    threshold: row.threshold,
    isRewardUnlocked: row.is_reward_unlocked,
    isInCooldown: row.is_in_cooldown,
    cooldownRemainingSeconds: row.cooldown_remaining_seconds,
  }));

const scanResultRowSchema = z
  .object({
    log_id: uuid,
    card_id: uuid,
    reward_label: z.string(),
    stamps: z.number().int(),
    threshold: z.number().int(),
    is_reward_unlocked: z.boolean(),
    replayed: z.boolean(),
  })
  .transform((row): ScanOutcome => ({
    logId: row.log_id,
    cardId: row.card_id,
    rewardLabel: row.reward_label,
    stamps: row.stamps,
    threshold: row.threshold,
    isRewardUnlocked: row.is_reward_unlocked,
    isReplay: row.replayed,
  }));

/** Validates the first row of `lookup_customer`; `null` when nothing matched. */
export function parseLookupRows(rows: unknown): CustomerLookup | null {
  const first = z.array(z.unknown()).safeParse(rows);
  if (!first.success || first.data.length === 0) {
    return null;
  }
  const parsed = lookupRowSchema.safeParse(first.data[0]);
  return parsed.success ? parsed.data : null;
}

/** Validates the composite returned by `record_visit`, `redeem_reward`, `reverse_scan`. */
export function parseScanResult(row: unknown): ScanOutcome | null {
  const parsed = scanResultRowSchema.safeParse(row);
  return parsed.success ? parsed.data : null;
}
