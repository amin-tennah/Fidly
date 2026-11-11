"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useOnlineStatus } from "@/features/pwa/hooks/use-online-status";

export interface CardsUpdatedAtProps {
  /** ISO time at which the server read the cards shown on this screen. */
  readonly updatedAt: string;
}

const TIME_FORMAT = new Intl.DateTimeFormat("fr-FR", { timeStyle: "short" });

function subscribeNever(): () => void {
  return () => undefined;
}

/**
 * Offline only: when the cards on screen were last read (roadmap 8.4). The time is
 * formatted in the browser's time zone, hence nothing on the server render.
 */
export function CardsUpdatedAt({ updatedAt }: CardsUpdatedAtProps): ReactNode {
  const isOnline = useOnlineStatus();
  const time = useSyncExternalStore(
    subscribeNever,
    () => TIME_FORMAT.format(new Date(updatedAt)),
    () => "",
  );

  if (isOnline || !time) {
    return null;
  }
  return (
    <p className="text-muted-foreground text-center text-sm">
      Hors ligne · cartes à jour à {time}
    </p>
  );
}
