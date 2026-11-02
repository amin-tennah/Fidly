import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BrandLogoTone = "cream" | "forest";

export interface BrandLogoProps {
  /** "cream" on a forest background, "forest" on a light one. */
  readonly tone?: BrandLogoTone;
  /** Rendered width in px; never below LOGO_MIN_WIDTH_PX (use the app icon instead). */
  readonly width?: number;
  readonly className?: string;
}

const LOGO_SRC: Record<BrandLogoTone, string> = {
  cream: "/brand/logo-rezone-cream.svg",
  forest: "/brand/logo-rezone-forest.svg",
};
const LOGO_ASPECT_RATIO = 2931.7 / 712;
const LOGO_MIN_WIDTH_PX = 80;
const LOGO_DEFAULT_WIDTH_PX = 120;

export function BrandLogo({
  tone = "forest",
  width = LOGO_DEFAULT_WIDTH_PX,
  className,
}: BrandLogoProps): ReactNode {
  const safeWidth = Math.max(width, LOGO_MIN_WIDTH_PX);
  return (
    <Image
      src={LOGO_SRC[tone]}
      alt="Rézone"
      width={safeWidth}
      height={Math.round(safeWidth / LOGO_ASPECT_RATIO)}
      unoptimized
      className={cn("h-auto", className)}
    />
  );
}
