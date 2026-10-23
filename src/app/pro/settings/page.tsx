import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { buildLoginPath } from "@/features/auth";
import { getAuthenticatedUser } from "@/features/auth/queries/get-session-context";
import { PRO_SETTINGS_PATH } from "@/features/restaurants/constants";
import { AddressCard } from "@/features/restaurants/components/address-card";
import { OpeningHoursCard } from "@/features/restaurants/components/opening-hours-card";
import { RestaurantIdentityCard } from "@/features/restaurants/components/restaurant-identity-card";
import { RestaurantSummaryCard } from "@/features/restaurants/components/restaurant-summary-card";
import { getActiveMembership } from "@/features/restaurants/queries/get-active-membership";
import { getRestaurantProfile } from "@/features/restaurants/queries/get-restaurant-profile";

export const metadata: Metadata = {
  title: "Réglages",
};

export default async function ProSettingsPage(): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(PRO_SETTINGS_PATH));
  }
  const active = await getActiveMembership(user.id);
  const profile = active ? await getRestaurantProfile(active.restaurantId) : null;
  if (!active || !profile) {
    notFound();
  }

  if (active.role !== "owner") {
    return <RestaurantSummaryCard profile={profile} />;
  }

  return (
    <div className="space-y-4">
      <RestaurantIdentityCard
        key={profile.id}
        restaurantId={profile.id}
        initialValues={{ name: profile.name, category: profile.category }}
      />
      <AddressCard
        key={`${profile.id}-a`}
        restaurantId={profile.id}
        currentAddress={profile.address}
      />
      <OpeningHoursCard
        key={`${profile.id}-h`}
        restaurantId={profile.id}
        initialHours={profile.openingHours}
      />
    </div>
  );
}
