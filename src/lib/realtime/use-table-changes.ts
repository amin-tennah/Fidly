"use client";

import { useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * `supabase.channel(name)` returns the existing channel when the name is taken, even one
 * that is being removed: React Strict Mode (dev) mounts every effect twice, so a fixed
 * name would hand the second mount a dying channel. Each subscription gets its own name.
 */
let channelSequence = 0;

export interface TableChangesOptions {
  readonly channel: string;
  readonly table: "loyalty_cards" | "scan_logs";
  /** PostgREST filter, e.g. `user_id=eq.<id>`: always set, the RLS applies as well. */
  readonly filter: string;
}

/**
 * Calls `onChange` for every change of the filtered rows, and once more each time the
 * channel reconnects (events sent while offline are lost: the caller re-reads its data).
 * The channel is always removed on cleanup.
 */
export function useTableChanges(
  options: TableChangesOptions,
  onChange: () => void,
): void {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const { channel: name, table, filter } = options;
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let hasSubscribed = false;
    channelSequence += 1;
    const channel = supabase
      .channel(`${name}:${channelSequence}`)
      .on("postgres_changes", { event: "*", schema: "public", table, filter }, () => {
        onChangeRef.current();
      })
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }
        if (hasSubscribed) {
          onChangeRef.current();
        }
        hasSubscribed = true;
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [name, table, filter]);
}
