import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  buildLoginPath,
  CLIENT_HOME_PATH,
  ONBOARDING_PATH,
  withNextParam,
} from "@/features/auth";
import {
  getAuthenticatedUser,
  getMyProfile,
  listMyPendingInvitations,
  listMyRestaurantMemberships,
} from "@/features/auth/queries/get-session-context";
import { ClientHomeHeader, CustomerQrHero, LoyaltyCardsList } from "@/features/loyalty";
import { listMyLoyaltyCards } from "@/features/loyalty/queries/list-my-loyalty-cards";

export default async function HomePage(): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(CLIENT_HOME_PATH));
  }

  const [profile, memberships, invitations, cards] = await Promise.all([
    getMyProfile(user.id),
    listMyRestaurantMemberships(user.id),
    listMyPendingInvitations(),
    listMyLoyaltyCards(user.id),
  ]);

  const displayName = profile?.displayName?.trim();
  if (!profile || !displayName) {
    redirect(withNextParam(ONBOARDING_PATH, CLIENT_HOME_PATH));
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 py-8">
      <ClientHomeHeader
        displayName={displayName}
        invitations={invitations}
        memberships={memberships}
      />
      <CustomerQrHero
        identity={{
          userId: user.id,
          displayName,
          qrToken: profile.qrToken,
          shortCode: profile.shortCode,
        }}
      />
      <LoyaltyCardsList cards={cards} />
    </main>
  );
}
