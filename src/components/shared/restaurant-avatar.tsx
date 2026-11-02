import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  md: { px: 40, classes: "size-10 text-base", tile: "rounded-[11px]" },
  list: { px: 44, classes: "size-11 text-lg", tile: "rounded-[12px]" },
  hero: { px: 48, classes: "size-12 text-xl", tile: "rounded-[14px]" },
  lg: { px: 56, classes: "size-14 text-xl", tile: "rounded-2xl" },
  xl: { px: 80, classes: "size-20 text-3xl", tile: "rounded-3xl" },
} as const;

export interface RestaurantAvatarProps {
  readonly name: string;
  readonly logoUrl: string | null;
  readonly size?: keyof typeof SIZES;
  /** "round" (default) or a rounded square "tile" as on the loyalty cards. */
  readonly shape?: "round" | "tile";
  readonly className?: string;
}

/** Restaurant logo, or the first letter of its name when it has none. */
export function RestaurantAvatar({
  name,
  logoUrl,
  size = "md",
  shape = "round",
  className,
}: RestaurantAvatarProps): ReactNode {
  const { px, classes, tile } = SIZES[size];
  const rounding = shape === "tile" ? tile : "rounded-full";
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={px}
        height={px}
        className={cn("shrink-0 object-cover", rounding, classes, className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-secondary text-secondary-foreground font-display flex shrink-0 items-center justify-center font-extrabold",
        rounding,
        classes,
        className,
      )}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
