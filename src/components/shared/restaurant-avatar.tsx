import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  md: { px: 40, classes: "size-10 text-base" },
  lg: { px: 56, classes: "size-14 text-xl" },
} as const;

export interface RestaurantAvatarProps {
  readonly name: string;
  readonly logoUrl: string | null;
  readonly size?: keyof typeof SIZES;
}

/** Round restaurant logo, or the first letter of its name when it has none. */
export function RestaurantAvatar({
  name,
  logoUrl,
  size = "md",
}: RestaurantAvatarProps): ReactNode {
  const { px, classes } = SIZES[size];
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={px}
        height={px}
        className={cn("shrink-0 rounded-full object-cover", classes)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-secondary text-secondary-foreground flex shrink-0 items-center justify-center rounded-full font-bold",
        classes,
      )}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
