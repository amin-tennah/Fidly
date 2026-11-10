import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { SignOutButton } from "@/features/auth";

export interface ClientHomeHeaderProps {
  readonly displayName: string;
}

function initialOf(displayName: string): string {
  return displayName.trim().charAt(0).toUpperCase();
}

/** Forest header: logo and avatar, then the greeting. The QR block overlaps its bottom edge. */
export function ClientHomeHeader({ displayName }: ClientHomeHeaderProps): ReactNode {
  return (
    <header className="bg-primary text-primary-foreground pt-safe-5.5 space-y-3 rounded-b-[28px] px-5 pb-[72px]">
      <div className="flex items-center justify-between gap-2">
        <BrandLogo tone="cream" width={116} />
        <span
          aria-hidden="true"
          className="bg-gain text-gain-foreground font-display flex size-11 shrink-0 items-center justify-center rounded-full text-xl font-extrabold"
        >
          {initialOf(displayName)}
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <h1 className="font-display truncate text-[30px] leading-[1.05] font-extrabold tracking-[-0.02em]">
          Salut {displayName}
        </h1>
        <SignOutButton
          variant="ghost"
          size="sm"
          className="text-primary-foreground hover:text-primary-foreground min-h-12 shrink-0 text-sm font-extrabold hover:bg-white/10"
        />
      </div>
    </header>
  );
}
