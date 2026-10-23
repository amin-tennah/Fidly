import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { buildLoginPath } from "@/features/auth";
import { getAuthenticatedUser } from "@/features/auth/queries/get-session-context";
import { ProgramsSection } from "@/features/programs";
import { listRestaurantPrograms } from "@/features/programs/queries/list-restaurant-programs";
import { OpeningHoursSection } from "@/features/restaurants/components/opening-hours-section";
import { RestaurantHero } from "@/features/restaurants/components/restaurant-hero";
import { PRO_SETTINGS_PATH } from "@/features/restaurants/constants";
import { todayDayKey } from "@/features/restaurants/domain/format-opening-hours";
import { getActiveMembership } from "@/features/restaurants/queries/get-active-membership";
import { getRestaurantProfile } from "@/features/restaurants/queries/get-restaurant-profile";

export const metadata: Metadata = {
  title: "Réglages",
};

/**
 * Overview of the restaurant. The owner gets an edit control on each block; the staff sees
 * the same page read-only (the actions and the database refuse anything but the owner).
 */
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

  const programs = await listRestaurantPrograms(profile.id);
  const canEdit = active.role === "owner";

  return (
    <div key={profile.id} className="space-y-4">
      <RestaurantHero profile={profile} canEdit={canEdit} />
      <OpeningHoursSection
        restaurantId={profile.id}
        hours={profile.openingHours}
        todayKey={todayDayKey(new Date())}
        canEdit={canEdit}
      />
      <ProgramsSection restaurantId={profile.id} programs={programs} canEdit={canEdit} />
    </div>
  );
}
