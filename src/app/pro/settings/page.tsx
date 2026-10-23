import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { buildLoginPath } from "@/features/auth";
import { getAuthenticatedUser } from "@/features/auth/queries/get-session-context";
import { ProgramsCard, programsSignature } from "@/features/programs";
import { listRestaurantPrograms } from "@/features/programs/queries/list-restaurant-programs";
import { OwnerSettings } from "@/features/restaurants/components/owner-settings";
import { RestaurantSummaryCard } from "@/features/restaurants/components/restaurant-summary-card";
import { PRO_SETTINGS_PATH } from "@/features/restaurants/constants";
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
  const programs = await listRestaurantPrograms(profile.id);
  return (
    <div className="space-y-4">
      <OwnerSettings key={profile.id} profile={profile} />
      <ProgramsCard
        key={programsSignature(programs)}
        restaurantId={profile.id}
        programs={programs}
      />
    </div>
  );
}
