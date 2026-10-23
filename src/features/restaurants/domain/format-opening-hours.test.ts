import { describe, expect, it } from "vitest";
import { formatDay, formatSlot, todayDayKey } from "./format-opening-hours";

describe("formatSlot / formatDay", () => {
  it("formats a plain slot", () => {
    expect(formatSlot({ open: "11:30", close: "14:30" })).toBe("11:30 – 14:30");
  });

  it("flags a slot closing the next day", () => {
    expect(formatSlot({ open: "22:00", close: "04:30" })).toBe(
      "22:00 – 04:30 (lendemain)",
    );
  });

  it("joins the slots of a day in opening order", () => {
    const slots = [
      { open: "19:00", close: "22:30" },
      { open: "11:30", close: "14:30" },
    ];
    expect(formatDay(slots)).toBe("11:30 – 14:30 · 19:00 – 22:30");
  });

  it("says closed for a day without slot", () => {
    expect(formatDay(undefined)).toBe("Fermé");
    expect(formatDay([])).toBe("Fermé");
  });
});

describe("todayDayKey", () => {
  it("reads the weekday in the restaurants' time zone", () => {
    // Sunday 23:30 UTC is already Monday 00:30 in Paris (winter time, UTC+1).
    expect(todayDayKey(new Date("2026-11-01T23:30:00Z"))).toBe("mon");
    expect(todayDayKey(new Date("2026-11-01T12:00:00Z"))).toBe("sun");
  });

  it("accepts another time zone", () => {
    expect(todayDayKey(new Date("2026-11-01T23:30:00Z"), "UTC")).toBe("sun");
  });
});
