import type { ReactNode } from "react";
import { PageTransition } from "@/components/shared/page-transition";
import { Skeleton } from "@/components/ui/skeleton";
import { CLIENT_HOME_PATH } from "@/features/auth";
import { CardBannerHeader } from "@/features/loyalty";

/** Same blocks as the card screen without banner: back link, forest hero card, next tier. */
export default function CardLoading(): ReactNode {
  return (
    <PageTransition>
      <main
        aria-busy="true"
        className="bg-background pb-safe-8 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4"
      >
        <CardBannerHeader bannerUrl={null} backHref={CLIENT_HOME_PATH}>
          <Skeleton className="bg-primary/85 h-[330px] w-full rounded-[28px]" />
        </CardBannerHeader>
        <div className="px-5">
          <Skeleton className="h-[72px] w-full rounded-[18px]" />
        </div>
      </main>
    </PageTransition>
  );
}
