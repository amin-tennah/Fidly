import { SEGMENTS_PER_ROW } from "@/features/loyalty/constants";

export interface Segment {
  readonly isFilled: boolean;
  /** The last segment of the tier shows the reward icon. */
  readonly isGift: boolean;
}

/** Lays out one segment per stamp in rows of SEGMENTS_PER_ROW. `count` is capped at `threshold` (13 / 10 fills 10). */
export function buildSegmentRows(count: number, threshold: number): Segment[][] {
  if (threshold <= 0) {
    return [];
  }
  const filled = Math.max(0, Math.min(count, threshold));
  const segments: Segment[] = Array.from({ length: threshold }, (_, index) => ({
    isFilled: index < filled,
    isGift: index === threshold - 1,
  }));
  const rows: Segment[][] = [];
  for (let start = 0; start < segments.length; start += SEGMENTS_PER_ROW) {
    rows.push(segments.slice(start, start + SEGMENTS_PER_ROW));
  }
  return rows;
}

/**
 * Columns of the segment grid: every row uses the width of a full first row, so that an
 * incomplete second row (13 / 15) keeps the same segment width instead of stretching.
 */
export function getSegmentColumns(threshold: number): number {
  return Math.max(1, Math.min(threshold, SEGMENTS_PER_ROW));
}
