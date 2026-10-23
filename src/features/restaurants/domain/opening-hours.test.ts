import { describe, expect, it } from "vitest";
import { openingHoursSchema } from "@/features/restaurants/schemas";
import { addSlot, closeDay, removeSlot, updateSlot } from "./edit-opening-hours";
import { validateDaySlots } from "./opening-hours";
import { validateWeek } from "./validate-week";

describe("validateDaySlots", () => {
  it("accepts lunch and dinner slots", () => {
    const slots = [
      { open: "11:30", close: "14:30" },
      { open: "19:00", close: "22:30" },
    ];
    expect(validateDaySlots(slots)).toBeNull();
  });

  it("accepts a slot closing after midnight", () => {
    expect(validateDaySlots([{ open: "18:00", close: "02:00" }])).toBeNull();
  });

  it("rejects an empty slot", () => {
    expect(validateDaySlots([{ open: "12:00", close: "12:00" }])).not.toBeNull();
  });

  it("rejects overlapping slots, including through midnight", () => {
    const overlap = [
      { open: "11:00", close: "15:00" },
      { open: "14:00", close: "18:00" },
    ];
    expect(validateDaySlots(overlap)).not.toBeNull();
    const overnight = [
      { open: "18:00", close: "02:00" },
      { open: "23:00", close: "23:30" },
    ];
    expect(validateDaySlots(overnight)).not.toBeNull();
  });
});

describe("openingHoursSchema", () => {
  it("rejects unknown days, bad times and too many slots", () => {
    expect(openingHoursSchema.safeParse({ xyz: [] }).success).toBe(false);
    expect(
      openingHoursSchema.safeParse({ mon: [{ open: "25:00", close: "12:00" }] }).success,
    ).toBe(false);
    const four = Array.from({ length: 4 }, (_, i) => ({
      open: `0${i + 1}:00`,
      close: `0${i + 1}:30`,
    }));
    expect(openingHoursSchema.safeParse({ mon: four }).success).toBe(false);
  });

  it("accepts an empty week and a valid day", () => {
    expect(openingHoursSchema.safeParse({}).success).toBe(true);
    expect(
      openingHoursSchema.safeParse({ tue: [{ open: "11:30", close: "14:30" }] }).success,
    ).toBe(true);
  });
});

describe("validateWeek", () => {
  const night = { open: "22:00", close: "04:30" };

  it("accepts a night slot when the next day opens later", () => {
    expect(
      validateWeek({ mon: [night], tue: [{ open: "11:30", close: "14:30" }] }),
    ).toBeNull();
    expect(validateWeek({ mon: [night] })).toBeNull();
  });

  it("rejects re-entering the early hours on the next day", () => {
    expect(
      validateWeek({ mon: [night], tue: [{ open: "00:00", close: "04:30" }] }),
    ).not.toBeNull();
  });

  it("wraps from Sunday to Monday", () => {
    expect(
      validateWeek({ sun: [night], mon: [{ open: "03:00", close: "05:00" }] }),
    ).not.toBeNull();
  });
});

describe("edit-opening-hours", () => {
  it("opens a day with the lunch slot then adds the evening slot", () => {
    const once = addSlot({}, "mon");
    expect(once.mon).toEqual([{ open: "11:30", close: "14:30" }]);
    expect(addSlot(once, "mon").mon?.[1]).toEqual({ open: "19:00", close: "22:30" });
  });

  it("caps the number of slots per day", () => {
    const full = addSlot(addSlot(addSlot({}, "mon"), "mon"), "mon");
    expect(addSlot(full, "mon").mon).toHaveLength(3);
  });

  it("closes a day when its last slot is removed", () => {
    expect(removeSlot(addSlot({}, "mon"), "mon", 0)).toEqual({});
    expect(closeDay(addSlot({}, "tue"), "tue")).toEqual({});
  });

  it("updates one field of one slot without touching the input", () => {
    const base = addSlot({}, "wed");
    const next = updateSlot(base, "wed", 0, { close: "15:00" });
    expect(next.wed?.[0]).toEqual({ open: "11:30", close: "15:00" });
    expect(base.wed?.[0]?.close).toBe("14:30");
  });
});
