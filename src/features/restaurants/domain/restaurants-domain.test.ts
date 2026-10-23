import { describe, expect, it } from "vitest";
import type { RestaurantMembershipSummary } from "@/features/auth";
import { parseAddressSuggestions } from "./parse-address-suggestions";
import { resolveActiveMembership } from "./resolve-active-membership";

function membership(id: string): RestaurantMembershipSummary {
  return { restaurantId: id, restaurantName: id, restaurantSlug: id, role: "owner" };
}

describe("resolveActiveMembership", () => {
  const list = [membership("a"), membership("b")];

  it("returns null without any membership", () => {
    expect(resolveActiveMembership([], "a")).toBeNull();
  });

  it("falls back to the first membership without a preference", () => {
    expect(resolveActiveMembership(list, undefined)?.restaurantId).toBe("a");
  });

  it("honours the remembered restaurant", () => {
    expect(resolveActiveMembership(list, "b")?.restaurantId).toBe("b");
  });

  it("ignores a remembered restaurant the user no longer belongs to", () => {
    expect(resolveActiveMembership(list, "zzz")?.restaurantId).toBe("a");
  });
});

describe("parseAddressSuggestions", () => {
  it("maps GeoJSON features to label and [lng, lat]", () => {
    const payload = {
      features: [
        {
          geometry: { coordinates: [2.35995, 48.855602] },
          properties: { label: "12 Rue de Rivoli 75004 Paris" },
        },
      ],
    };
    expect(parseAddressSuggestions(payload)).toEqual([
      { label: "12 Rue de Rivoli 75004 Paris", lng: 2.35995, lat: 48.855602 },
    ]);
  });

  it("returns nothing for unexpected payloads", () => {
    expect(parseAddressSuggestions(null)).toEqual([]);
    expect(parseAddressSuggestions({ features: [{ foo: 1 }] })).toEqual([]);
    expect(parseAddressSuggestions("<html>")).toEqual([]);
  });
});
