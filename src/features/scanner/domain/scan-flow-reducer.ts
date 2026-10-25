import type {
  CustomerLookup,
  DoneKind,
  ScanKeys,
  ScanOutcome,
} from "@/features/scanner/types";

export type ScanFlowState =
  | { readonly step: "idle"; readonly notice: string | null }
  | { readonly step: "looking" }
  | {
      readonly step: "customer";
      readonly customer: CustomerLookup;
      readonly keys: ScanKeys;
      readonly error: string | null;
      readonly isSubmitting: boolean;
    }
  | {
      readonly step: "done";
      readonly kind: DoneKind;
      readonly customerName: string;
      readonly outcome: ScanOutcome;
      readonly keys: ScanKeys;
      readonly error: string | null;
      readonly isReversing: boolean;
    };

export type ScanFlowEvent =
  | { readonly type: "lookupStarted" }
  | { readonly type: "lookupFailed"; readonly message: string }
  | {
      readonly type: "customerFound";
      readonly customer: CustomerLookup;
      readonly keys: ScanKeys;
    }
  | { readonly type: "submitStarted" }
  | {
      readonly type: "submitFailed";
      readonly message: string;
      readonly isCooldown: boolean;
    }
  | {
      readonly type: "submitSucceeded";
      readonly kind: DoneKind;
      readonly outcome: ScanOutcome;
    }
  | { readonly type: "reverseStarted" }
  | { readonly type: "reverseFailed"; readonly message: string }
  | { readonly type: "reversed"; readonly message: string }
  | { readonly type: "closed" };

export const INITIAL_SCAN_FLOW: ScanFlowState = { step: "idle", notice: null };

function onCustomer(
  state: ScanFlowState,
  update: (current: Extract<ScanFlowState, { step: "customer" }>) => ScanFlowState,
): ScanFlowState {
  return state.step === "customer" ? update(state) : state;
}

function onDone(
  state: ScanFlowState,
  update: (current: Extract<ScanFlowState, { step: "done" }>) => ScanFlowState,
): ScanFlowState {
  return state.step === "done" ? update(state) : state;
}

function failSubmit(
  state: ScanFlowState,
  message: string,
  isCooldown: boolean,
): ScanFlowState {
  return onCustomer(state, (s) => ({
    ...s,
    error: message,
    isSubmitting: false,
    // Another device credited this customer meanwhile: ask for an explicit confirmation.
    customer: isCooldown ? { ...s.customer, isInCooldown: true } : s.customer,
  }));
}

function foundCustomer(customer: CustomerLookup, keys: ScanKeys): ScanFlowState {
  return { step: "customer", customer, keys, error: null, isSubmitting: false };
}

function succeedSubmit(
  state: ScanFlowState,
  kind: DoneKind,
  outcome: ScanOutcome,
): ScanFlowState {
  return onCustomer(state, (s) => ({
    step: "done",
    kind,
    customerName: s.customer.displayName,
    outcome,
    keys: s.keys,
    error: null,
    isReversing: false,
  }));
}

export function scanFlowReducer(
  state: ScanFlowState,
  event: ScanFlowEvent,
): ScanFlowState {
  switch (event.type) {
    case "lookupStarted":
      return { step: "looking" };
    case "lookupFailed":
      return { step: "idle", notice: event.message };
    case "customerFound":
      return foundCustomer(event.customer, event.keys);
    case "submitStarted":
      return onCustomer(state, (s) => ({ ...s, error: null, isSubmitting: true }));
    case "submitFailed":
      return failSubmit(state, event.message, event.isCooldown);
    case "submitSucceeded":
      return succeedSubmit(state, event.kind, event.outcome);
    case "reverseStarted":
      return onDone(state, (s) => ({ ...s, error: null, isReversing: true }));
    case "reverseFailed":
      return onDone(state, (s) => ({ ...s, error: event.message, isReversing: false }));
    case "reversed":
      return { step: "idle", notice: event.message };
    case "closed":
      return INITIAL_SCAN_FLOW;
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}
