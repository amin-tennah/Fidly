import { describe, expect, it } from "vitest";
import type { LoyaltyCardView, LoyaltyProgramSummary } from "@/features/loyalty/types";
import { computeCardProgress } from "./compute-card-progress";
import { detectCardCelebrations } from "./detect-card-celebrations";

const TIERS: LoyaltyProgramSummary[] = [1, 2].map((position) => ({
  id: `p${position}`,
  position,
  threshold: position * 10,
  rewardLabel: `Reward ${position}`,
  isActive: true,
  rewardImageUrl: null,
}));

function card(stamps: number, programId = "p1", cardId = "c1"): LoyaltyCardView {
  return {
    cardId,
    restaurantId: `r-${cardId}`,
    restaurantName: `Restaurant ${cardId}`,
    restaurantSlug: cardId,
    restaurantLogoUrl: null,
    restaurantCoverUrl: null,
    progress: computeCardProgress({ stamps, currentProgramId: programId }, TIERS),
  };
}

describe("detectCardCelebrations", () => {
  it("celebrates nothing on the first render", () => {
    expect(detectCardCelebrations(null, [card(10)])).toEqual([]);
  });

  it("celebrates nothing when the cards did not change", () => {
    expect(detectCardCelebrations([card(5)], [card(5)])).toEqual([]);
  });

  it("reports one stamp with the counter before and after", () => {
    const events = detectCardCelebrations([card(5)], [card(6)]);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ kind: "stamp", cardId: "c1", from: 5, to: 6 });
    expect(events[0]?.progress.threshold).toBe(10);
  });

  it("merges two stamps received at once into a single celebration", () => {
    const events = detectCardCelebrations([card(5)], [card(7)]);
    expect(events).toMatchObject([{ kind: "stamp", from: 5, to: 7 }]);
  });

  it("does not roll the counter of a card seen for the first time", () => {
    expect(detectCardCelebrations([], [card(1)])).toEqual([]);
  });

  it("plays the stamp, then the reward, when the visit unlocks it", () => {
    const events = detectCardCelebrations([card(9)], [card(10)]);
    expect(events.map((event) => event.kind)).toEqual(["stamp", "reward"]);
  });

  it("does not replay a reward that was already available", () => {
    const events = detectCardCelebrations([card(10)], [card(11)]);
    expect(events.map((event) => event.kind)).toEqual(["stamp"]);
  });

  it("celebrates the reward of the next tier once it is reached", () => {
    const events = detectCardCelebrations([card(19, "p2")], [card(20, "p2")]);
    expect(events.map((event) => event.kind)).toEqual(["stamp", "reward"]);
  });
});

describe("detectCardCelebrations - nothing to celebrate", () => {
  it("celebrates nothing when a visit is cancelled", () => {
    expect(detectCardCelebrations([card(10)], [card(9)])).toEqual([]);
    expect(detectCardCelebrations([card(6)], [card(5)])).toEqual([]);
  });

  it("celebrates nothing when a reward is redeemed and the card moves on", () => {
    expect(detectCardCelebrations([card(10)], [card(10, "p2")])).toEqual([]);
  });

  it("ignores a card whose program is unavailable", () => {
    const broken = { ...card(5), progress: null };
    expect(detectCardCelebrations([card(4)], [broken])).toEqual([]);
  });

  it("keeps the order of the cards and their own colour", () => {
    const events = detectCardCelebrations(
      [card(1, "p1", "a"), card(2, "p1", "b")],
      [card(2, "p1", "a"), card(3, "p1", "b")],
    );
    expect(events.map((event) => event.cardId)).toEqual(["a", "b"]);
    expect(events.every((event) => event.hue >= 1 && event.hue <= 6)).toBe(true);
  });
});
