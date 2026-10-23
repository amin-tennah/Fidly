import { describe, expect, it } from "vitest";
import { clampCropArea, computeOutputSize } from "./crop-geometry";

describe("clampCropArea", () => {
  it("rounds to whole pixels", () => {
    const area = { x: 10.4, y: 20.6, width: 100.5, height: 50.2 };
    expect(clampCropArea(area, 1000, 1000)).toEqual({
      x: 10,
      y: 21,
      width: 101,
      height: 50,
    });
  });

  it("keeps the crop inside the image", () => {
    const area = { x: 900.4, y: -3, width: 200, height: 2000 };
    expect(clampCropArea(area, 1000, 600)).toEqual({
      x: 900,
      y: 0,
      width: 100,
      height: 600,
    });
  });

  it("never returns an empty area", () => {
    const area = { x: 5000, y: 5000, width: 0, height: 0 };
    const clamped = clampCropArea(area, 100, 100);
    expect(clamped.width).toBeGreaterThanOrEqual(1);
    expect(clamped.height).toBeGreaterThanOrEqual(1);
  });
});

describe("computeOutputSize", () => {
  it("scales the longest side down to the limit, keeping the ratio", () => {
    expect(computeOutputSize({ x: 0, y: 0, width: 3200, height: 1800 }, 800)).toEqual({
      width: 800,
      height: 450,
    });
    expect(computeOutputSize({ x: 0, y: 0, width: 2000, height: 2000 }, 800)).toEqual({
      width: 800,
      height: 800,
    });
  });

  it("never upscales a small crop", () => {
    expect(computeOutputSize({ x: 0, y: 0, width: 300, height: 200 }, 800)).toEqual({
      width: 300,
      height: 200,
    });
  });
});
