import { describe, expect, it } from "vitest";
import { CARD_HUE_COUNT } from "@/features/loyalty/constants";
import { getCardHue } from "./card-hue";

describe("getCardHue", () => {
  it("is deterministic", () => {
    const id = "6f1c2c1e-9a5b-4a52-8d1e-0d3c5a7b9e11";
    expect(getCardHue(id)).toBe(getCardHue(id));
  });

  it("stays within 1..CARD_HUE_COUNT", () => {
    for (let i = 0; i < 500; i += 1) {
      const hue = getCardHue(`restaurant-${i}`);
      expect(hue).toBeGreaterThanOrEqual(1);
      expect(hue).toBeLessThanOrEqual(CARD_HUE_COUNT);
    }
  });

  it("spreads ids over every hue", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 200; i += 1) seen.add(getCardHue(`restaurant-${i}`));
    expect(seen.size).toBe(CARD_HUE_COUNT);
  });
});
