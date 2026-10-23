import { describe, expect, it } from "vitest";
import { createRestaurantSchema, inviteOwnerSchema } from "@/features/admin/schemas";
import { buildEaselUrl, easelFileName, fitFontSize, invitationExpiry } from "./easel";
import { formatShortDate } from "./format-date";
import { slugCandidate, slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases, removes accents and joins words with hyphens", () => {
    expect(slugify("Chez Pépé & Fils")).toBe("chez-pepe-fils");
    expect(slugify("  L'Été   Indien ")).toBe("l-ete-indien");
  });

  it("always yields a valid slug", () => {
    const valid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    for (const name of ["Burger&Co", "123", "--A--", "日本料理", "!!!"]) {
      expect(slugify(name)).toMatch(valid);
    }
  });

  it("falls back when nothing usable remains", () => {
    expect(slugify("!!!")).toBe("restaurant");
  });

  it("caps the length without leaving a trailing hyphen", () => {
    const slug = slugify(`${"a".repeat(59)} bbbbbbbb`);
    expect(slug.length).toBeLessThanOrEqual(60);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("slugCandidate", () => {
  it("suffixes from the second attempt", () => {
    expect(slugCandidate("burger-co", 0)).toBe("burger-co");
    expect(slugCandidate("burger-co", 1)).toBe("burger-co-2");
    expect(slugCandidate("burger-co", 2)).toBe("burger-co-3");
  });
});

describe("easel helpers", () => {
  it("builds the QR address without a double slash and encodes the slug", () => {
    expect(buildEaselUrl("https://fidly.app/", "chez-pepe")).toBe(
      "https://fidly.app/?ref=chez-pepe",
    );
    expect(buildEaselUrl("http://localhost:3000", "a b")).toBe(
      "http://localhost:3000/?ref=a%20b",
    );
  });

  it("names the file after the slug", () => {
    expect(easelFileName("chez-pepe")).toBe("chevalet-chez-pepe.png");
  });

  it("picks the largest font size that fits", () => {
    const measure = (px: number): number => px * 10;
    expect(fitFontSize(measure, 1000, 110, 56)).toBe(100);
    expect(fitFontSize(measure, 5000, 110, 56)).toBe(110);
  });

  it("never goes below the minimum size", () => {
    expect(fitFontSize((px) => px * 100, 10, 110, 56)).toBe(56);
  });

  it("expires an invitation 14 days after its creation", () => {
    const now = new Date("2026-10-23T10:00:00Z");
    expect(invitationExpiry(now).toISOString()).toBe("2026-11-06T10:00:00.000Z");
  });
});

describe("admin schemas", () => {
  it("normalises the owner email and requires a name", () => {
    const parsed = createRestaurantSchema.safeParse({
      name: "  Chez Pépé ",
      category: "pizza",
      ownerEmail: "  Pepe@Example.COM ",
    });
    expect(parsed.success && parsed.data.ownerEmail).toBe("pepe@example.com");
    expect(parsed.success && parsed.data.name).toBe("Chez Pépé");
    expect(
      createRestaurantSchema.safeParse({
        name: " ",
        category: "pizza",
        ownerEmail: "a@b.fr",
      }).success,
    ).toBe(false);
  });

  it("rejects a bad email, an unknown category and a bad restaurant id", () => {
    expect(
      createRestaurantSchema.safeParse({
        name: "X",
        category: "pizza",
        ownerEmail: "nope",
      }).success,
    ).toBe(false);
    expect(
      createRestaurantSchema.safeParse({
        name: "X",
        category: "sushi",
        ownerEmail: "a@b.fr",
      }).success,
    ).toBe(false);
    expect(
      inviteOwnerSchema.safeParse({ restaurantId: "x", email: "a@b.fr" }).success,
    ).toBe(false);
  });
});

describe("formatShortDate", () => {
  it("formats day/month/year in the restaurants' time zone", () => {
    expect(formatShortDate("2026-11-06T10:00:00Z")).toBe("06/11/2026");
    // 23:30 UTC on the 6th is already the 7th in Paris (winter time).
    expect(formatShortDate("2026-11-06T23:30:00Z")).toBe("07/11/2026");
  });
});
