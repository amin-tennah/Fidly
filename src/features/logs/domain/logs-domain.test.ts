import { describe, expect, it } from "vitest";
import { describeLogType } from "@/features/logs/domain/describe-log-type";
import { formatLogTime } from "@/features/logs/domain/format-log-time";
import { mergeHeadEntries } from "@/features/logs/domain/merge-log-entries";
import { parseScanLogRows } from "@/features/logs/schemas";
import type { ScanLogEntry } from "@/features/logs/types";

function entry(id: string, overrides: Partial<ScanLogEntry> = {}): ScanLogEntry {
  return {
    id,
    createdAt: "2026-07-14T10:05:00+00:00",
    type: "visit",
    rewardLabel: "Dessert",
    customerName: "Sam",
    staffName: "Lea",
    isCooldownOverridden: false,
    reversesLogId: null,
    isReversed: false,
    reversedAt: null,
    ...overrides,
  };
}

describe("formatLogTime", () => {
  it("shows date and time in the restaurant time zone (summer time)", () => {
    expect(formatLogTime("2026-07-14T10:05:00+00:00")).toBe("14 juil. · 12:05");
  });

  it("shows date and time in the restaurant time zone (winter time)", () => {
    expect(formatLogTime("2026-01-05T23:30:00+00:00")).toBe("6 janv. · 00:30");
  });
});

describe("describeLogType", () => {
  it("labels each kind of line", () => {
    expect(describeLogType("visit")).toBe("Passage +1");
    expect(describeLogType("reward_redeemed")).toBe("Récompense");
    expect(describeLogType("reversal")).toBe("Annulation");
  });
});

describe("mergeHeadEntries", () => {
  it("puts new entries first and keeps the older loaded pages", () => {
    const merged = mergeHeadEntries([entry("b"), entry("a")], [entry("c"), entry("b")]);
    expect(merged.map((e) => e.id)).toEqual(["c", "b", "a"]);
  });

  it("takes the fresh version of an entry that was reversed meanwhile", () => {
    const merged = mergeHeadEntries([entry("a")], [entry("a", { isReversed: true })]);
    expect(merged[0]?.isReversed).toBe(true);
  });
});

describe("parseScanLogRows", () => {
  const row = {
    log_id: "a7a7a7a7-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    created_at: "2026-07-14T10:05:00.123456+00:00",
    type: "visit",
    cooldown_overridden: false,
    reward_label: "Dessert",
    customer_name: null,
    staff_name: "Lea",
    reverses_log_id: null,
    is_reversed: false,
    reversed_at: null,
  };

  it("keeps the microsecond precision of the cursor and anonymised names as null", () => {
    const page = parseScanLogRows([row]);
    expect(page?.entries[0]).toMatchObject({
      createdAt: "2026-07-14T10:05:00.123456+00:00",
      customerName: null,
    });
  });

  it("reports older logs when the extra row is present", () => {
    const rows = Array.from({ length: 26 }, () => row);
    expect(parseScanLogRows(rows)).toMatchObject({ hasMore: true });
    expect(parseScanLogRows(rows)?.entries).toHaveLength(25);
  });

  it("rejects malformed rows", () => {
    expect(parseScanLogRows([{ ...row, type: "other" }])).toBeNull();
  });
});
