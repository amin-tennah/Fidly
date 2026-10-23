import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  buildLoginPath,
  CLIENT_HOME_PATH,
  INVITATION_PATH,
  ONBOARDING_PATH,
  PRO_HOME_PATH,
  withNextParam,
} from "@/features/auth";
import {
  getAuthenticatedUser,
  getMyProfile,
  listMyPendingInvitations,
  listMyRestaurantMemberships,
} from "@/features/auth/queries/get-session-context";
import { ProBottomNav, ProHeader } from "@/features/restaurants";
import { getActiveMembership } from "@/features/restaurants/queries/get-active-membership";
import { getRestaurantProfile } from "@/features/restaurants/queries/get-restaurant-profile";

interface ProLayoutProps {
  readonly children: ReactNode;
}

export default async function ProLayout({
  children,
}: ProLayoutProps): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(PRO_HOME_PATH));
  }

  const profile = await getMyProfile(user.id);
  if (!profile?.displayName?.trim()) {
    redirect(withNextParam(ONBOARDING_PATH, PRO_HOME_PATH));
  }

  const [memberships, active] = await Promise.all([
    listMyRestaurantMemberships(user.id),
    getActiveMembership(user.id),
  ]);
  if (!active) {
    const pendingInvitations = await listMyPendingInvitations();
    redirect(pendingInvitations.length > 0 ? INVITATION_PATH : CLIENT_HOME_PATH);
  }

  const restaurant = await getRestaurantProfile(active.restaurantId);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 pt-6 pb-24">
      <ProHeader
        memberships={memberships}
        active={active}
        logoUrl={restaurant?.logoUrl ?? null}
      />
      {children}
      <ProBottomNav />
    </div>
  );
}
