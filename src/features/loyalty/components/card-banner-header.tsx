import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { BackLink } from "@/components/shared/back-link";

export interface CardBannerHeaderProps {
  readonly bannerUrl: string | null;
  readonly backHref: string;
  /** The hero card: it overlaps the banner and never disappears. */
  readonly children: ReactNode;
}

function BannerBackButton({ href }: { readonly href: string }): ReactNode {
  return (
    <BackLink
      href={href}
      aria-label="Retour à mes cartes"
      className="bg-cream text-primary top-safe-4 absolute left-5 flex size-12 items-center justify-center rounded-full shadow-sm"
    >
      <ChevronLeft className="size-6" strokeWidth={3} aria-hidden="true" />
    </BackLink>
  );
}

function TextBackLink({ href }: { readonly href: string }): ReactNode {
  return (
    <BackLink
      href={href}
      className="text-primary -ml-1 inline-flex min-h-12 items-center gap-1 text-[15px] font-extrabold"
    >
      <ChevronLeft className="size-5" strokeWidth={3} aria-hidden="true" />
      Mes cartes
    </BackLink>
  );
}

/** Header of a restaurant card screen: optional 150 px banner (hero overlaps it by 40 px) or a text back link. */
export function CardBannerHeader({
  bannerUrl,
  backHref,
  children,
}: CardBannerHeaderProps): ReactNode {
  if (!bannerUrl) {
    return (
      <div className="pt-safe-3.5 px-5">
        <TextBackLink href={backHref} />
        <div className="mt-1.5">{children}</div>
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
        <BannerBackButton href={backHref} />
      </div>
      <div className="relative -mt-10 px-5">{children}</div>
    </div>
  );
}
