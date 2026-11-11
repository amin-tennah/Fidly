"use client";

import { WifiOff } from "lucide-react";
import type { ReactNode } from "react";
import { useOnlineStatus } from "@/features/pwa/hooks/use-online-status";

/** Discreet « Hors ligne » pill above every screen, announced politely to screen readers. */
export function OfflineIndicator(): ReactNode {
  const isOnline = useOnlineStatus();

  return (
    <div
      role="status"
      className="top-safe-2 pointer-events-none fixed inset-x-0 z-[60] flex justify-center"
    >
      {isOnline ? null : (
        <span className="bg-foreground text-cream inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-extrabold shadow-lg">
          <WifiOff aria-hidden="true" className="size-4" />
          Hors ligne
        </span>
      )}
    </div>
  );
}
