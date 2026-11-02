import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export interface CardBannerHeaderProps {
  readonly bannerUrl: string | null;
  readonly backHref: string;
  /** The hero card: it overlaps the banner and never disappears. */
  readonly children: ReactNode;
}

function BackLink({
  href,
  onBanner,
}: {
  readonly href: string;
  readonly onBanner: boolean;
}): ReactNode {
  const colors = onBanner
    ? "bg-white/90 text-foreground absolute top-4 left-4 shadow-sm"
    : "bg-secondary text-foreground";
  return (
    <Link
      href={href}
      aria-label="Retour à mes cartes"
      className={`${colors} flex size-12 items-center justify-center rounded-full`}
    >
      <ChevronLeft className="size-6" aria-hidden="true" />
    </Link>
  );
}

/** Header of a restaurant card screen: optional 150 px banner (hero overlaps it by 40 px) or a plain back row. */
export function CardBannerHeader({
  bannerUrl,
  backHref,
  children,
}: CardBannerHeaderProps): ReactNode {
  if (!bannerUrl) {
    return (
      <div className="space-y-4">
        <BackLink href={backHref} onBanner={false} />
        {children}
      </div>
    );
  }
  return (
    <div>
      <div className="relative h-[150px] overflow-hidden rounded-b-[28px]">
        <Image
          src={bannerUrl}
          alt=""
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
        />
        <BackLink href={backHref} onBanner />
      </div>
      <div className="relative -mt-10 px-4">{children}</div>
    </div>
  );
}
