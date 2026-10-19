import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: ComponentProps<"input">): ReactNode {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-11 w-full rounded-lg border px-3.5 py-2 text-base shadow-xs transition-colors outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}
