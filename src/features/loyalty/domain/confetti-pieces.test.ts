import { describe, expect, it } from "vitest";
import {
  CONFETTI_COLOR_COUNT,
  REWARD_MEDAL_CONFETTI,
  SCAN_REVEAL_CONFETTI,
} from "@/features/loyalty/constants";
import { buildConfettiPieces } from "./confetti-pieces";

describe("buildConfettiPieces", () => {
  it("makes the requested number of pieces", () => {
    expect(buildConfettiPieces(SCAN_REVEAL_CONFETTI)).toHaveLength(12);
    expect(buildConfettiPieces({ ...SCAN_REVEAL_CONFETTI, count: 0 })).toEqual([]);
  });

  it("is deterministic", () => {
    expect(buildConfettiPieces(SCAN_REVEAL_CONFETTI)).toEqual(
      buildConfettiPieces(SCAN_REVEAL_CONFETTI),
    );
  });

  it("throws pieces to the left and to the right of the centre", () => {
    const offsets = buildConfettiPieces(SCAN_REVEAL_CONFETTI).map((piece) => piece.dxPx);
    expect(Math.min(...offsets)).toBeLessThan(0);
    expect(Math.max(...offsets)).toBeGreaterThan(0);
  });

  it("starts every piece after the burst delay and uses every colour", () => {
    const pieces = buildConfettiPieces(SCAN_REVEAL_CONFETTI);
    expect(pieces.every((piece) => piece.delayMs >= SCAN_REVEAL_CONFETTI.delayMs)).toBe(
      true,
    );
    expect(new Set(pieces.map((piece) => piece.colorIndex)).size).toBe(
      CONFETTI_COLOR_COUNT,
    );
  });

  it("keeps the reward burst within the confetti budget", () => {
    expect(buildConfettiPieces(REWARD_MEDAL_CONFETTI).length).toBeLessThanOrEqual(24);
  });
});
