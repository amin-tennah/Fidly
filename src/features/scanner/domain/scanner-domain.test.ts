import { formatCooldownRemaining } from "@/features/scanner/domain/format-cooldown";
import { describe, expect, it } from "vitest";
import { mapScanRpcError } from "@/features/scanner/domain/map-scan-error";
import {
  classifyScanInput,
  normalizeScanInput,
} from "@/features/scanner/domain/normalize-scan-input";
import { parseLookupRows, parseScanResult } from "@/features/scanner/schemas";

const UUID_A = "a6a6a6a6-aaaa-4aaa-8aaa-aaaaaaaaaaa1";
const UUID_B = "b6b6b6b6-bbbb-4bbb-8bbb-bbbbbbbbbbb1";

describe("normalizeScanInput", () => {
  it("upper-cases and drops spaces and dashes", () => {
    expect(normalizeScanInput(" ab3-k9m ")).toBe("AB3K9M");
  });

  it("truncates very long input", () => {
    expect(normalizeScanInput("A".repeat(5000))).toHaveLength(64);
  });
});

describe("classifyScanInput", () => {
  it("recognises a 20-character QR token", () => {
    expect(classifyScanInput("ABCDEFGHIJKLMNOPQRST")).toBe("qr_token");
  });

  it("recognises a 6-character short code, even typed in lower case", () => {
    expect(classifyScanInput("ab3-k9m")).toBe("short_code");
  });

  it("rejects ambiguous characters of the short-code alphabet", () => {
    expect(classifyScanInput("AB30IL")).toBe("invalid");
  });

  it.each(["", "http://evil.example/?x=1", "A".repeat(5000), "ABCDE"])(
    "rejects forged content %#",
    (raw) => {
      expect(classifyScanInput(raw)).toBe("invalid");
    },
  );
});

describe("mapScanRpcError", () => {
  it.each([
    ["cooldown_active", "COOLDOWN_ACTIVE"],
    ["reward_not_available", "REWARD_NOT_UNLOCKED"],
    ["rate_limited", "RATE_LIMITED"],
    ["already_reversed", "REVERSAL_ALREADY_DONE"],
    ["not_latest_operation", "REVERSAL_NOT_ALLOWED"],
    ["forbidden", "FORBIDDEN"],
    ["something unexpected", "INTERNAL_ERROR"],
  ])("maps %s to %s", (message, code) => {
    expect(mapScanRpcError(message)).toBe(code);
  });
});

describe("parseLookupRows", () => {
  const row = {
    customer_id: UUID_A,
    display_name: "Sam",
    card_id: null,
    reward_label: "Dessert",
    stamps: 0,
    threshold: 10,
    is_reward_unlocked: false,
    is_in_cooldown: false,
    cooldown_remaining_seconds: 0,
  };

  it("maps a row to a customer without card", () => {
    expect(parseLookupRows([row])).toMatchObject({ displayName: "Sam", cardId: null });
  });

  it("returns null when nothing matched or the row is malformed", () => {
    expect(parseLookupRows([])).toBeNull();
    expect(parseLookupRows([{ ...row, stamps: "x" }])).toBeNull();
    expect(parseLookupRows(null)).toBeNull();
  });
});

describe("parseScanResult", () => {
  it("maps the composite returned by the RPC", () => {
    const outcome = parseScanResult({
      log_id: UUID_A,
      card_id: UUID_B,
      reward_label: "Menu",
      stamps: 13,
      threshold: 20,
      is_reward_unlocked: false,
      replayed: true,
    });
    expect(outcome).toMatchObject({ stamps: 13, threshold: 20, isReplay: true });
  });

  it("rejects an incomplete composite", () => {
    expect(parseScanResult({ log_id: UUID_A })).toBeNull();
  });
});

describe("formatCooldownRemaining", () => {
  it.each([
    [0, "moins d'une minute"],
    [45 * 60, "45 min"],
    [4380, "1 h 13 min"],
    [7200, "2 h"],
  ])("formats %i seconds as %s", (seconds, label) => {
    expect(formatCooldownRemaining(seconds)).toBe(label);
  });
});
