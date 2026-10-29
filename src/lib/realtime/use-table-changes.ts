"use client";

import { useEffect } from "react";
import { authorizeRealtime } from "@/lib/realtime/authorize-realtime";
import {
  openTableChannel,
  type TableChangesOptions,
} from "@/lib/realtime/open-table-channel";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useLatest } from "@/lib/use-latest";

export type { TableChangesOptions };

/**
 * Calls `onChange` for every change of the filtered rows, and once more each time the
 * channel reconnects. The channel is joined with the user's token and always removed
 * on cleanup (the first Strict Mode mount is cancelled before it ever joins).
 */
export function useTableChanges(
  options: TableChangesOptions,
  onChange: () => void,
): void {
  const onChangeRef = useLatest(onChange);
  const { channel, table, filter } = options;

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let isCancelled = false;
    let close: (() => void) | undefined;

    void authorizeRealtime(supabase).then(() => {
      if (isCancelled) {
        return;
      }
      close = openTableChannel(supabase, { channel, table, filter }, () =>
        onChangeRef.current(),
      );
    });

    return () => {
      isCancelled = true;
      close?.();
    };
  }, [channel, table, filter, onChangeRef]);
}
