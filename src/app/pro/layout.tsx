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

  const memberships = await listMyRestaurantMemberships(user.id);
  if (memberships.length === 0) {
    const pendingInvitations = await listMyPendingInvitations();
    if (pendingInvitations.length > 0) {
      redirect(INVITATION_PATH);
    }
    redirect(CLIENT_HOME_PATH);
  }

  return <>{children}</>;
}
