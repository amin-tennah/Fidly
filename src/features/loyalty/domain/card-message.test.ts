import { describe, expect, it } from "vitest";
import type { CardProgress, LoyaltyProgramSummary } from "@/features/loyalty/types";
import { describeCardMessage } from "./card-message";

const program: LoyaltyProgramSummary = {
  id: "p1",
  position: 1,
  threshold: 10,
  rewardLabel: "Menu offert",
  isActive: true,
  rewardImageUrl: null,
};

function progressOf(stamps: number): CardProgress {
  return {
    program,
    nextProgram: program,
    stamps,
    threshold: 10,
    isRewardUnlocked: stamps >= 10,
    progressPercent: Math.min(100, stamps * 10),
  };
}

describe("describeCardMessage", () => {
  it("counts the remaining stamps", () => {
    expect(describeCardMessage(progressOf(8))).toBe(
      "Plus que 2 passages avant ta récompense",
    );
  });

  it("uses the singular for the last stamp", () => {
    expect(describeCardMessage(progressOf(9))).toBe(
      "Plus que 1 passage avant ta récompense",
    );
  });

  it("announces the reward once unlocked, even past the threshold", () => {
    expect(describeCardMessage(progressOf(13))).toBe(
      "C'est gagné ! Montre cet écran en caisse.",
    );
  });
});
