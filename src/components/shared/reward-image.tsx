import { Gift } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { px: 40, classes: "size-10" },
  md: { px: 64, classes: "size-16" },
} as const;

export interface RewardImageProps {
  readonly url: string | null;
  readonly size?: keyof typeof SIZES;
  /** Shows a neutral gift icon when there is no image (otherwise nothing is rendered). */
  readonly showPlaceholder?: boolean;
}

/** Reward picture of a loyalty tier, from the public `restaurant-media` bucket. */
export function RewardImage({
  url,
  size = "sm",
  showPlaceholder = false,
}: RewardImageProps): ReactNode {
  const { px, classes } = SIZES[size];
  if (url) {
    return (
      <Image
        src={url}
        alt=""
        width={px}
        height={px}
        className={cn("shrink-0 rounded-md object-cover", classes)}
      />
    );
  }
  if (!showPlaceholder) {
    return null;
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-md",
        classes,
      )}
    >
      <Gift className="size-5" />
    </span>
  );
}
