import { describe, expect, it } from "vitest";
import { buildSegmentRows, getSegmentColumns } from "./segment-rows";

describe("buildSegmentRows", () => {
  it("makes one segment per stamp of the tier", () => {
    const rows = buildSegmentRows(3, 10);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveLength(10);
    expect(rows[0]?.filter((segment) => segment.isFilled)).toHaveLength(3);
  });

  it("puts the gift icon on the last segment only", () => {
    const flat = buildSegmentRows(0, 10).flat();
    expect(flat.filter((segment) => segment.isGift)).toHaveLength(1);
    expect(flat.at(-1)?.isGift).toBe(true);
  });

  it("splits a 20-stamp tier into two rows of 10", () => {
    const rows = buildSegmentRows(13, 20);
    expect(rows.map((row) => row.length)).toEqual([10, 10]);
    expect(rows.flat().filter((segment) => segment.isFilled)).toHaveLength(13);
  });

  it("caps the filled count at the threshold (13 / 10)", () => {
    expect(
      buildSegmentRows(13, 10)
        .flat()
        .every((segment) => segment.isFilled),
    ).toBe(true);
  });

  it("returns no rows for an invalid threshold", () => {
    expect(buildSegmentRows(2, 0)).toEqual([]);
  });
});

describe("getSegmentColumns", () => {
  it("gives a short tier one column per stamp", () => {
    expect(getSegmentColumns(6)).toBe(6);
    expect(getSegmentColumns(10)).toBe(10);
  });

  it("keeps the grid of a full first row beyond 10 stamps", () => {
    expect([11, 13, 15, 20].map(getSegmentColumns)).toEqual([10, 10, 10, 10]);
    expect(buildSegmentRows(13, 15).map((row) => row.length)).toEqual([10, 5]);
    expect(buildSegmentRows(11, 11).map((row) => row.length)).toEqual([10, 1]);
  });

  it("never returns an empty grid", () => {
    expect(getSegmentColumns(0)).toBe(1);
  });
});
