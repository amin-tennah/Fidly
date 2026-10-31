import { SCAN_RPC_TIMEOUT_MS } from "@/features/scanner/constants";
import { mapScanRpcError } from "@/features/scanner/domain/map-scan-error";
import {
  classifyScanInput,
  normalizeScanInput,
} from "@/features/scanner/domain/normalize-scan-input";
import { toScanResult } from "@/features/scanner/rpc/to-scan-result";
import { timeoutSignal } from "@/features/scanner/rpc/timeout-signal";
import {
  lookupCustomerSchema,
  parseLookupRows,
  recordVisitSchema,
  redeemRewardSchema,
  reverseScanSchema,
  type LookupCustomerInput,
  type RecordVisitInput,
  type RedeemRewardInput,
  type ReverseScanInput,
} from "@/features/scanner/schemas";
import type { CustomerLookup, ScanOutcome } from "@/features/scanner/types";
import { type ActionResult, err, ok } from "@/lib/errors";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Scan RPCs called straight from the browser (ADR-022). A Server Action would be queued
 * behind any slow one (Next.js dispatches them one at a time), so a single hung request
 * froze the scanner. Security stays in the database: every function checks `auth.uid()`
 * and the membership, and `lookup_customer` rate-limits failed searches.
 */
export async function lookupCustomerRpc(
  input: LookupCustomerInput,
): Promise<ActionResult<CustomerLookup>> {
  const parsed = lookupCustomerSchema.safeParse(input);
  if (!parsed.success || classifyScanInput(parsed.data.tokenOrCode) === "invalid") {
    return err("CUSTOMER_NOT_FOUND");
  }
  const { data, error } = await getSupabaseBrowserClient()
    .rpc("lookup_customer", {
      p_token_or_code: normalizeScanInput(parsed.data.tokenOrCode),
      p_restaurant_id: parsed.data.restaurantId,
    })
    .abortSignal(timeoutSignal(SCAN_RPC_TIMEOUT_MS));
  if (error) {
    return err(mapScanRpcError(error.message));
  }
  const customer = parseLookupRows(data);
  return customer ? ok(customer) : err("CUSTOMER_NOT_FOUND");
}

export async function recordVisitRpc(
  input: RecordVisitInput,
): Promise<ActionResult<ScanOutcome>> {
  const parsed = recordVisitSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR");
  }
  const { data, error } = await getSupabaseBrowserClient()
    .rpc("record_visit", {
      p_restaurant_id: parsed.data.restaurantId,
      p_customer_id: parsed.data.customerId,
      p_idempotency_key: parsed.data.idempotencyKey,
      p_force_cooldown: parsed.data.forceCooldown,
    })
    .abortSignal(timeoutSignal(SCAN_RPC_TIMEOUT_MS));
  return toScanResult(data, error);
}

export async function redeemRewardRpc(
  input: RedeemRewardInput,
): Promise<ActionResult<ScanOutcome>> {
  const parsed = redeemRewardSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR");
  }
  const { data, error } = await getSupabaseBrowserClient()
    .rpc("redeem_reward", {
      p_restaurant_id: parsed.data.restaurantId,
      p_card_id: parsed.data.cardId,
      p_idempotency_key: parsed.data.idempotencyKey,
    })
    .abortSignal(timeoutSignal(SCAN_RPC_TIMEOUT_MS));
  return toScanResult(data, error);
}

export async function reverseScanRpc(
  input: ReverseScanInput,
): Promise<ActionResult<ScanOutcome>> {
  const parsed = reverseScanSchema.safeParse(input);
  if (!parsed.success) {
    return err("VALIDATION_ERROR");
  }
  const { data, error } = await getSupabaseBrowserClient()
    .rpc("reverse_scan", {
      p_restaurant_id: parsed.data.restaurantId,
      p_log_id: parsed.data.logId,
      p_idempotency_key: parsed.data.idempotencyKey,
    })
    .abortSignal(timeoutSignal(SCAN_RPC_TIMEOUT_MS));
  return toScanResult(data, error);
}
