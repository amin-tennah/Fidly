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
      className="border-input bg-background font-display min-h-14 w-full min-w-0 rounded-2xl border-2 px-3 text-xl font-extrabold"
    >
      {memberships.map((m) => (
        <option key={m.restaurantId} value={m.restaurantId}>
          {m.restaurantName}
        </option>
      ))}
    </select>
  );
}
