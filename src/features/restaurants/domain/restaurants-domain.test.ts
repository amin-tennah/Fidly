import { describe, expect, it } from "vitest";
import type { RestaurantMembershipSummary } from "@/features/auth";
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
