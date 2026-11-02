import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { buildLoginPath, CLIENT_HOME_PATH } from "@/features/auth";
import { getAuthenticatedUser } from "@/features/auth/queries/get-session-context";
import {
  CardBannerHeader,
  LoyaltyHeroCard,
  LoyaltyRealtimeSync,
  NextTierBlock,
} from "@/features/loyalty";
import { listMyLoyaltyCards } from "@/features/loyalty/queries/list-my-loyalty-cards";

export const metadata: Metadata = {
  title: "Ma carte",
};

interface CardPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export default async function CardPage({ params }: CardPageProps): Promise<ReactNode> {
  const { slug } = await params;
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(CLIENT_HOME_PATH));
  }

  const cards = await listMyLoyaltyCards(user.id);
  const card = cards.find((item) => item.restaurantSlug === slug);
  if (!card?.progress) {
    notFound();
  }

  return (
    <main className="animate-slide-in mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 pb-8">
      <CardBannerHeader bannerUrl={card.restaurantCoverUrl} backHref={CLIENT_HOME_PATH}>
        <LoyaltyHeroCard card={card} progress={card.progress} />
      </CardBannerHeader>
      <div className="px-5">
        <NextTierBlock progress={card.progress} />
      </div>
      <LoyaltyRealtimeSync userId={user.id} />
    </main>
  );
}
