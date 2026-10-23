"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import type { RestaurantMembershipSummary } from "@/features/auth";
import { selectActiveRestaurant } from "@/features/restaurants/actions/select-restaurant";

export interface RestaurantSwitcherProps {
  readonly memberships: readonly RestaurantMembershipSummary[];
  readonly activeRestaurantId: string;
}

export function RestaurantSwitcher({
  memberships,
  activeRestaurantId,
}: RestaurantSwitcherProps): ReactNode {
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const restaurantId = event.target.value;
    startTransition(async () => {
      const res = await selectActiveRestaurant({ restaurantId });
      if (!res.ok) {
        toast.error(res.error.message);
      }
    });
  };

  return (
    <select
      aria-label="Changer d'établissement"
      value={activeRestaurantId}
      disabled={isPending}
      onChange={handleChange}
      className="border-input bg-background h-12 w-full rounded-lg border px-3 text-base font-bold"
    >
      {memberships.map((m) => (
        <option key={m.restaurantId} value={m.restaurantId}>
          {m.restaurantName}
        </option>
      ))}
    </select>
  );
}
