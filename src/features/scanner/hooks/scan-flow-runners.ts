import { lookupCustomer } from "@/features/scanner/actions/lookup-customer";
import { recordVisit } from "@/features/scanner/actions/record-visit";
import { redeemReward } from "@/features/scanner/actions/redeem-reward";
import { reverseScan } from "@/features/scanner/actions/reverse-scan";
import type { ScanFlowEvent } from "@/features/scanner/domain/scan-flow-reducer";
import { runScanAction } from "@/features/scanner/hooks/run-scan-action";
import type { CustomerLookup, ScanKeys, ScanOutcome } from "@/features/scanner/types";
import { triggerScanFeedback } from "@/features/scanner/utils/scan-feedback";

export type ScanDispatch = (event: ScanFlowEvent) => void;

export function newScanKeys(): ScanKeys {
  return {
    visit: crypto.randomUUID(),
    redeem: crypto.randomUUID(),
    reverse: crypto.randomUUID(),
  };
}

/** Resolves to true when a customer was found (the scanner stays locked until closed). */
export async function runLookup(
  dispatch: ScanDispatch,
  restaurantId: string,
  raw: string,
): Promise<boolean> {
  dispatch({ type: "lookupStarted" });
  const result = await runScanAction(() =>
    lookupCustomer({ restaurantId, tokenOrCode: raw }),
  );
  if (!result.ok) {
    dispatch({ type: "lookupFailed", message: result.error.message });
    return false;
  }
  dispatch({ type: "customerFound", customer: result.data, keys: newScanKeys() });
  return true;
}

async function runCredit(
  dispatch: ScanDispatch,
  kind: "visit" | "redeem",
  call: () => ReturnType<typeof recordVisit>,
): Promise<void> {
  dispatch({ type: "submitStarted" });
  const result = await runScanAction(call);
  if (!result.ok) {
    dispatch({
      type: "submitFailed",
      message: result.error.message,
      isCooldown: result.error.code === "COOLDOWN_ACTIVE",
    });
    return;
  }
  triggerScanFeedback();
  dispatch({ type: "submitSucceeded", kind, outcome: result.data });
}

export function runVisit(
  dispatch: ScanDispatch,
  restaurantId: string,
  customer: CustomerLookup,
  keys: ScanKeys,
): Promise<void> {
  return runCredit(dispatch, "visit", () =>
    recordVisit({
      restaurantId,
      customerId: customer.customerId,
      idempotencyKey: keys.visit,
      forceCooldown: customer.isInCooldown,
    }),
  );
}

export function runReward(
  dispatch: ScanDispatch,
  restaurantId: string,
  cardId: string,
  keys: ScanKeys,
): Promise<void> {
  return runCredit(dispatch, "redeem", () =>
    redeemReward({ restaurantId, cardId, idempotencyKey: keys.redeem }),
  );
}

/** Resolves to true when the scan was cancelled. */
export async function runReverse(
  dispatch: ScanDispatch,
  restaurantId: string,
  outcome: ScanOutcome,
  keys: ScanKeys,
): Promise<boolean> {
  dispatch({ type: "reverseStarted" });
  const result = await runScanAction(() =>
    reverseScan({ restaurantId, logId: outcome.logId, idempotencyKey: keys.reverse }),
  );
  if (!result.ok) {
    dispatch({ type: "reverseFailed", message: result.error.message });
    return false;
  }
  dispatch({ type: "reversed", message: "Dernier scan annulé." });
  return true;
}
