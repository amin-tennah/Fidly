import Image from "next/image";
import type { ReactNode } from "react";
import { APP_ICON_SRC } from "@/features/pwa/constants";
import { cn } from "@/lib/utils";

export interface AppIconProps {
  /** Rendered size in px (the icon is square). */
  readonly size: number;
  readonly className?: string;
}

/** The Rézone app icon, as it appears on a home screen. Decorative. */
export function AppIcon({ size, className }: AppIconProps): ReactNode {
  return (
    <Image
      src={APP_ICON_SRC}
      alt=""
      width={size}
      height={size}
      unoptimized
      className={cn("shrink-0", className)}
    />
  );
}
