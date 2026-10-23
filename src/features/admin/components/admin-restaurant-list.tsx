import type { ReactNode } from "react";
import type { AdminRestaurantRow } from "@/features/admin/types";
import { AdminRestaurantCard } from "./admin-restaurant-card";

export interface AdminRestaurantListProps {
  readonly restaurants: readonly AdminRestaurantRow[];
  readonly appUrl: string;
}

export function AdminRestaurantList({
  restaurants,
  appUrl,
}: AdminRestaurantListProps): ReactNode {
  if (restaurants.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">Aucun restaurant pour le moment.</p>
    );
  }
  return (
    <ul className="space-y-3">
      {restaurants.map((restaurant) => (
        <li key={restaurant.id}>
          <AdminRestaurantCard restaurant={restaurant} appUrl={appUrl} />
        </li>
      ))}
    </ul>
  );
}
