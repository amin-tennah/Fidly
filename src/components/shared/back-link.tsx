"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { NAV_BACK } from "@/lib/navigation/constants";
import { hasInAppBackEntry } from "@/lib/navigation/nav-direction";

export interface BackLinkProps {
  /** Where "back" leads when the previous screen is not in the history (direct visit). */
  readonly href: string;
  readonly className?: string;
  readonly "aria-label"?: string;
  readonly children: ReactNode;
}

const BACK_TYPES = [NAV_BACK];

/**
 * In-app back button. It pops the history when the previous screen is there (so the phone
 * back button never returns to the screen just left) and replaces the entry otherwise.
 */
export function BackLink({ href, children, ...props }: BackLinkProps): ReactNode {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    if (hasInAppBackEntry()) {
      event.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      {...props}
      href={href}
      replace
      transitionTypes={BACK_TYPES}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
