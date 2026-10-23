import type { ReactNode } from "react";
import { CROP_MAX_ZOOM, CROP_MIN_ZOOM, CROP_ZOOM_STEP } from "@/features/media/constants";

export function ZoomSlider({
  zoom,
  onZoomChange,
}: {
  readonly zoom: number;
  readonly onZoomChange: (zoom: number) => void;
}): ReactNode {
  return (
    <label className="flex items-center gap-3 text-sm font-medium">
      Zoom
      <input
        type="range"
        min={CROP_MIN_ZOOM}
        max={CROP_MAX_ZOOM}
        step={CROP_ZOOM_STEP}
        value={zoom}
        aria-label="Zoom"
        className="h-12 flex-1"
        onChange={(e) => onZoomChange(Number(e.target.value))}
      />
    </label>
  );
}
