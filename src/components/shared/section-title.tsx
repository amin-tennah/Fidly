import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps {
  readonly children: ReactNode;
  readonly id?: string;
  readonly className?: string;
}

/** Title of a section inside a screen (`<h2>`): Bricolage 800, 21 px, as « Mes cartes ». */
export function SectionTitle({ children, id, className }: SectionTitleProps): ReactNode {
  return (
    <h2
      id={id}
      className={cn("font-display text-[21px] font-extrabold tracking-tight", className)}
    >
      {children}
    </h2>
  );
}
