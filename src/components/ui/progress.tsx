"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Progress({
  className,
  value,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Root>): ReactNode {
  const clampedValue = Math.min(100, Math.max(0, value ?? 0));

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-secondary relative h-3 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-accent h-full w-full flex-1 transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
