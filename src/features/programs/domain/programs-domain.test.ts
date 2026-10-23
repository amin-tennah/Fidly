import { describe, expect, it } from "vitest";
import type { ProgramView } from "@/features/programs/types";
import { mapProgramRpcError } from "./map-program-error";
import { findRuleViolation, previewReorder, suggestNextThreshold } from "./program-rules";

function program(
  id: string,
  position: number,
  threshold: number,
  isActive = true,
): ProgramView {
  return { id, position, threshold, rewardLabel: id, isActive };
}

describe("findRuleViolation", () => {
  it("accepts strictly increasing thresholds", () => {
    expect(findRuleViolation([program("a", 1, 10), program("b", 2, 20)])).toBeNull();
  });

  it("rejects equal or decreasing thresholds", () => {
    expect(findRuleViolation([program("a", 1, 10), program("b", 2, 10)])).toBe(
      "not_increasing",
    );
    expect(findRuleViolation([program("a", 1, 20), program("b", 2, 10)])).toBe(
      "not_increasing",
    );
  });

  it("ignores deactivated tiers", () => {
    const programs = [
      program("a", 1, 10),
      program("b", 2, 5, false),
      program("c", 3, 20),
    ];
    expect(findRuleViolation(programs)).toBeNull();
  });

  it("rejects more than five active tiers", () => {
    const six = Array.from({ length: 6 }, (_, i) =>
      program(`p${i}`, i + 1, (i + 1) * 10),
    );
    expect(findRuleViolation(six)).toBe("too_many");
  });
});

describe("suggestNextThreshold", () => {
  it("proposes ten more than the last active tier", () => {
    expect(suggestNextThreshold([program("a", 1, 10), program("b", 2, 25)])).toBe(35);
    expect(suggestNextThreshold([])).toBe(10);
  });
});

describe("previewReorder", () => {
  const programs = [
    program("dessert", 1, 10),
    program("menu", 2, 20),
    program("old", 3, 99, false),
  ];

  it("keeps thresholds on the places and moves the rewards", () => {
    const result = previewReorder(programs, ["menu", "dessert"]);
    expect(result.map((p) => `${p.id}:${p.position}/${p.threshold}`)).toEqual([
      "menu:1/10",
      "dessert:2/20",
      "old:3/99",
    ]);
  });

  it("keeps deactivated tiers after the active ones", () => {
    expect(previewReorder(programs, ["dessert", "menu"]).at(-1)?.id).toBe("old");
  });
});

describe("mapProgramRpcError", () => {
  it("maps the messages raised by the RPCs", () => {
    expect(mapProgramRpcError("thresholds_not_increasing")).toBe(
      "PROGRAM_THRESHOLDS_INVALID",
    );
    expect(mapProgramRpcError("too_many_programs")).toBe("PROGRAM_LIMIT_REACHED");
    expect(mapProgramRpcError("invalid_program_order")).toBe("PROGRAM_ORDER_INVALID");
    expect(mapProgramRpcError("forbidden")).toBe("FORBIDDEN");
  });

  it("falls back to a generic error for anything else", () => {
    expect(mapProgramRpcError("connection reset")).toBe("INTERNAL_ERROR");
  });
});
