"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useTransition } from "react";
import { useResyncOnReturn } from "@/lib/realtime/use-resync-on-return";
import { useTableChanges } from "@/lib/realtime/use-table-changes";

/** Several events can arrive together (visit + redeem): one refresh is enough. */
const REFRESH_DEBOUNCE_MS = 200;

/**
 * Keeps the customer's cards in sync with the server. The payload only carries raw
 * columns, so the page is re-read instead (tier resolution stays on the server).
 */
export function useLoyaltyCardsRealtime(userId: string): void {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback((): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      startTransition(() => router.refresh());
    }, REFRESH_DEBOUNCE_MS);
  }, [router]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  useTableChanges(
    {
      channel: `loyalty-cards:${userId}`,
      table: "loyalty_cards",
      filter: `user_id=eq.${userId}`,
    },
    refresh,
  );
  useResyncOnReturn(refresh);
}
