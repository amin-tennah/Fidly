import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Styled native `<select>`: best mobile UX (OS picker), same look as `Input`. */
export function NativeSelect({
  className,
  ...props
}: ComponentProps<"select">): ReactNode {
  return (
    <select
      className={cn(
        "border-input bg-background h-12 w-full rounded-lg border-2 px-3 text-base disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
