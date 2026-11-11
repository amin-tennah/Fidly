"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { NAV_FORWARD } from "@/lib/navigation/constants";
import { markForwardNavigation } from "@/lib/navigation/nav-direction";

export interface ForwardLinkProps {
  readonly href: string;
  readonly className?: string;
  readonly "aria-label"?: string;
  readonly children: ReactNode;
}

const FORWARD_TYPES = [NAV_FORWARD];

/** Link that goes one step deeper: the destination slides in from the right. */
export function ForwardLink({ children, ...props }: ForwardLinkProps): ReactNode {
  return (
    <Link {...props} transitionTypes={FORWARD_TYPES} onNavigate={markForwardNavigation}>
      {children}
    </Link>
  );
}
