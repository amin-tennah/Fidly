import type { CropArea } from "@/features/restaurants/types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Rounds a crop to whole pixels and keeps it inside the image (rounding can overshoot by 1 px). */
export function clampCropArea(
  area: CropArea,
  imageWidth: number,
  imageHeight: number,
): CropArea {
  const x = clamp(Math.round(area.x), 0, Math.max(0, imageWidth - 1));
  const y = clamp(Math.round(area.y), 0, Math.max(0, imageHeight - 1));
  return {
    x,
    y,
    width: clamp(Math.round(area.width), 1, imageWidth - x),
    height: clamp(Math.round(area.height), 1, imageHeight - y),
  };
}

/** Output size: the crop scaled down so its longest side is at most `maxSide` (never upscaled). */
export function computeOutputSize(
  area: CropArea,
  maxSide: number,
): { readonly width: number; readonly height: number } {
  const ratio = Math.min(1, maxSide / Math.max(area.width, area.height));
  return {
    width: Math.max(1, Math.round(area.width * ratio)),
    height: Math.max(1, Math.round(area.height * ratio)),
  };
}
