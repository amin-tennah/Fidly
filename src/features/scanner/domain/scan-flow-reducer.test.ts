import { describe, expect, it } from "vitest";
import {
  INITIAL_SCAN_FLOW,
  scanFlowReducer,
  type ScanFlowState,
} from "@/features/scanner/domain/scan-flow-reducer";
import type { CustomerLookup, ScanKeys, ScanOutcome } from "@/features/scanner/types";

const customer: CustomerLookup = {
  customerId: "c",
  displayName: "Sam",
  cardId: null,
  rewardLabel: "Dessert",
  stamps: 0,
  threshold: 10,
  isRewardUnlocked: false,
  isInCooldown: false,
  cooldownRemainingSeconds: 0,
};
const keys: ScanKeys = { visit: "v", redeem: "r", reverse: "x" };
const outcome: ScanOutcome = {
  logId: "l",
  cardId: "k",
  rewardLabel: "Dessert",
  stamps: 1,
  threshold: 10,
  isRewardUnlocked: false,
  isReplay: false,
};

function atCustomer(): ScanFlowState {
  return scanFlowReducer(INITIAL_SCAN_FLOW, { type: "customerFound", customer, keys });
}

describe("scanFlowReducer", () => {
  it("shows the customer, then the success state keeping the same keys", () => {
    const submitting = scanFlowReducer(atCustomer(), { type: "submitStarted" });
    expect(submitting).toMatchObject({ step: "customer", isSubmitting: true });
    const done = scanFlowReducer(submitting, {
      type: "submitSucceeded",
      kind: "visit",
      outcome,
    });
    expect(done).toMatchObject({
      step: "done",
      kind: "visit",
      customerName: "Sam",
      keys,
    });
  });

  it("keeps the customer and the keys after a failure so a retry is idempotent", () => {
    const failed = scanFlowReducer(
      scanFlowReducer(atCustomer(), { type: "submitStarted" }),
      { type: "submitFailed", message: "Réseau", isCooldown: false },
    );
    expect(failed).toMatchObject({
      step: "customer",
      isSubmitting: false,
      error: "Réseau",
      keys,
    });
  });

  it("flags the cooldown when another device credited the customer meanwhile", () => {
    const failed = scanFlowReducer(atCustomer(), {
      type: "submitFailed",
      message: "Cooldown",
      isCooldown: true,
    });
    expect(failed).toMatchObject({ customer: { isInCooldown: true } });
  });
});

describe("scanFlowReducer (exits)", () => {
  it("goes back to idle with a notice after a reversal or a failed lookup", () => {
    const done = scanFlowReducer(atCustomer(), {
      type: "submitSucceeded",
      kind: "visit",
      outcome,
    });
    expect(scanFlowReducer(done, { type: "reversed", message: "Annulé" })).toEqual({
      step: "idle",
      notice: "Annulé",
    });
    expect(
      scanFlowReducer(INITIAL_SCAN_FLOW, { type: "lookupFailed", message: "?" }),
    ).toEqual({
      step: "idle",
      notice: "?",
    });
  });

  it("ignores submit events outside the customer step", () => {
    expect(scanFlowReducer(INITIAL_SCAN_FLOW, { type: "submitStarted" })).toBe(
      INITIAL_SCAN_FLOW,
    );
  });
});
