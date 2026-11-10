import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  buildLoginPath,
  CLIENT_HOME_PATH,
  ONBOARDING_PATH,
  ProAccessBanners,
  withNextParam,
} from "@/features/auth";
import {
  getAuthenticatedUser,
  getMyProfile,
  isUserPlatformAdmin,
  listMyPendingInvitations,
  listMyRestaurantMemberships,
} from "@/features/auth/queries/get-session-context";
import { PageTransition } from "@/components/shared/page-transition";
import {
  ClientHomeHeader,
  CustomerQrHero,
  IntroSplash,
  LoyaltyCardsList,
  LoyaltyRealtimeSync,
} from "@/features/loyalty";
import { listMyLoyaltyCards } from "@/features/loyalty/queries/list-my-loyalty-cards";

/** Everything the home shows, read in parallel. */
function loadHomeData(userId: string) {
  return Promise.all([
    getMyProfile(userId),
    listMyRestaurantMemberships(userId),
    listMyPendingInvitations(),
    listMyLoyaltyCards(userId),
    isUserPlatformAdmin(userId),
  ]);
}

export default async function HomePage(): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(CLIENT_HOME_PATH));
  }

  const [profile, memberships, invitations, cards, isPlatformAdmin] = await loadHomeData(
    user.id,
  );

  const displayName = profile?.displayName?.trim();
  if (!profile || !displayName) {
    redirect(withNextParam(ONBOARDING_PATH, CLIENT_HOME_PATH));
  }

  return (
    <PageTransition>
      <main className="bg-background pb-safe-8 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6">
        <IntroSplash />
        <ClientHomeHeader displayName={displayName} />
        <div className="-mt-14 space-y-5 px-5">
          <CustomerQrHero
            identity={{
              userId: user.id,
              displayName,
              qrToken: profile.qrToken,
              shortCode: profile.shortCode,
            }}
          />
          <ProAccessBanners
            invitations={invitations}
            memberships={memberships}
            isPlatformAdmin={isPlatformAdmin}
          />
          <LoyaltyCardsList cards={cards} />
        </div>
        <LoyaltyRealtimeSync userId={user.id} />
      </main>
    </PageTransition>
  );
}
