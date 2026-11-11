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
      className="bg-background border-track pb-safe-0 fixed inset-x-0 bottom-0 z-40 border-t-2"
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
                  "flex h-[72px] flex-col items-center justify-center gap-1 text-xs font-extrabold",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-6" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
