import { describe, expect, it } from "vitest";
import type { LoyaltyProgramSummary } from "@/features/loyalty/types";
import { computeCardProgress } from "./compute-card-progress";
import { formatShortCode } from "./format-short-code";

function tier(
  position: number,
  threshold: number,
  overrides: Partial<LoyaltyProgramSummary> = {},
): LoyaltyProgramSummary {
  return {
    id: `p${position}`,
    position,
    threshold,
    rewardLabel: `Reward ${position}`,
    isActive: true,
    ...overrides,
  };
}

const TWO_TIERS = [tier(1, 10), tier(2, 20)];

describe("computeCardProgress - progression", () => {
  it("shows an empty bar for a card without visits", () => {
    const progress = computeCardProgress(
      { stamps: 0, currentProgramId: "p1" },
      TWO_TIERS,
    );
    expect(progress).toMatchObject({
      stamps: 0,
      threshold: 10,
      isRewardUnlocked: false,
      progressPercent: 0,
    });
  });

  it("shows a partial progression below the threshold", () => {
    const progress = computeCardProgress(
      { stamps: 7, currentProgramId: "p1" },
      TWO_TIERS,
    );
    expect(progress).toMatchObject({ isRewardUnlocked: false, progressPercent: 70 });
  });

  it("unlocks the reward exactly at the threshold", () => {
    const progress = computeCardProgress(
      { stamps: 10, currentProgramId: "p1" },
      TWO_TIERS,
    );
    expect(progress).toMatchObject({ isRewardUnlocked: true, progressPercent: 100 });
  });
});

describe("computeCardProgress - cumulative stamps (ADR-009)", () => {
  it("keeps cumulating beyond the threshold (13 / 10) with a capped bar", () => {
    const progress = computeCardProgress(
      { stamps: 13, currentProgramId: "p1" },
      TWO_TIERS,
    );
    expect(progress).toMatchObject({
      stamps: 13,
      threshold: 10,
      isRewardUnlocked: true,
      progressPercent: 100,
    });
  });

  it("displays 13 / 20 once the tier 2 is the current one", () => {
    const progress = computeCardProgress(
      { stamps: 13, currentProgramId: "p2" },
      TWO_TIERS,
    );
    expect(progress).toMatchObject({
      stamps: 13,
      threshold: 20,
      isRewardUnlocked: false,
      progressPercent: 65,
    });
    expect(progress?.program.id).toBe("p2");
  });
});

describe("computeCardProgress - next tier and ordering", () => {
  it("announces the next tier, looping on the first one after the last tier", () => {
    const onFirst = computeCardProgress({ stamps: 3, currentProgramId: "p1" }, TWO_TIERS);
    const onLast = computeCardProgress({ stamps: 20, currentProgramId: "p2" }, TWO_TIERS);
    expect(onFirst?.nextProgram.id).toBe("p2");
    expect(onLast?.nextProgram.id).toBe("p1");
    expect(onLast?.isRewardUnlocked).toBe(true);
  });

  it("loops on itself when the restaurant has a single tier", () => {
    const progress = computeCardProgress({ stamps: 2, currentProgramId: "p1" }, [
      tier(1, 8),
    ]);
    expect(progress?.nextProgram.id).toBe("p1");
  });

  it("sorts tiers by position, whatever the input order", () => {
    const shuffled = [tier(2, 20), tier(1, 10)];
    const progress = computeCardProgress({ stamps: 4, currentProgramId: "p1" }, shuffled);
    expect(progress?.nextProgram.id).toBe("p2");
  });
});

describe("computeCardProgress - tier changes (Q-013)", () => {
  it("moves to the next active tier when the current one is deactivated (Q-013)", () => {
    const programs = [tier(1, 10, { isActive: false }), tier(2, 20)];
    const progress = computeCardProgress(
      { stamps: 13, currentProgramId: "p1" },
      programs,
    );
    expect(progress).toMatchObject({ stamps: 13, threshold: 20, progressPercent: 65 });
    expect(progress?.program.id).toBe("p2");
  });

  it("wraps to the first active tier when the deactivated tier was the last one", () => {
    const programs = [tier(1, 10), tier(2, 20, { isActive: false })];
    const progress = computeCardProgress({ stamps: 5, currentProgramId: "p2" }, programs);
    expect(progress?.program.id).toBe("p1");
  });

  it("applies a threshold edited by the owner immediately (Q-013)", () => {
    const programs = [tier(1, 5), tier(2, 20)];
    const progress = computeCardProgress({ stamps: 7, currentProgramId: "p1" }, programs);
    expect(progress).toMatchObject({ threshold: 5, isRewardUnlocked: true });
  });

  it("returns null when no tier is active or defined", () => {
    const inactive = [tier(1, 10, { isActive: false })];
    expect(
      computeCardProgress({ stamps: 3, currentProgramId: "p1" }, inactive),
    ).toBeNull();
    expect(computeCardProgress({ stamps: 3, currentProgramId: "p1" }, [])).toBeNull();
  });
});

describe("formatShortCode", () => {
  it("groups the 6 characters in two blocks of 3", () => {
    expect(formatShortCode("7DNWSA")).toBe("7DN WSA");
  });

  it.each([null, undefined, "", "ABC", "ABCDEFG"])(
    "falls back to a placeholder for %s",
    (value) => {
      expect(formatShortCode(value)).toBe("--- ---");
    },
  );
});
