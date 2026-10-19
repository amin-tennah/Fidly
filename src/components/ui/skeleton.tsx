import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: ComponentProps<"div">): ReactNode {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-lg", className)}
      {...props}
    />
  );
}
