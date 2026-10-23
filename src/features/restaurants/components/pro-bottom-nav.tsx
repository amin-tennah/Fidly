"use client";

import { ChartColumn, ScanLine, ScrollText, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PRO_NAV_ITEMS, PRO_SCANNER_PATH } from "@/features/restaurants/constants";
import { cn } from "@/lib/utils";

const ICONS = {
  scanner: ScanLine,
  logs: ScrollText,
  stats: ChartColumn,
  settings: Settings,
} as const;

function isActive(pathname: string, href: string): boolean {
  return href === PRO_SCANNER_PATH ? pathname === href : pathname.startsWith(href);
}

export function ProBottomNav(): ReactNode {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation espace restaurateur"
      className="bg-background/95 border-border fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur"
    >
      <ul className="mx-auto flex max-w-md">
        {PRO_NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium",
                  active ? "text-accent" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
