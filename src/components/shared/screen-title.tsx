import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ScreenTitleProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/** The one `<h1>` of a screen: Bricolage 800, 28 px (05b-ECRANS-SPEC §1). */
export function ScreenTitle({ children, className }: ScreenTitleProps): ReactNode {
  return (
    <h1
      className={cn(
        "font-display text-foreground text-[28px] leading-[1.05] font-extrabold tracking-[-0.02em]",
        className,
      )}
    >
      {children}
    </h1>
  );
}
