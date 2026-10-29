import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export interface TableChangesOptions {
  readonly channel: string;
  readonly table: "loyalty_cards" | "scan_logs";
  /** PostgREST filter, e.g. `user_id=eq.<id>`: always set, the RLS applies as well. */
  readonly filter: string;
}

/**
 * `supabase.channel(name)` returns the existing channel when the name is taken, even one
 * that is being removed: React Strict Mode (dev) mounts every effect twice, so a fixed
 * name would hand the second mount a dying channel. Each subscription gets its own name.
 */
let channelSequence = 0;

/**
 * Subscribes to the changes of the filtered rows; returns the function that removes the
 * channel. `onChange` also fires each time the channel reconnects: events sent while
 * offline are lost, the caller re-reads its data.
 */
export function openTableChannel(
  supabase: SupabaseClient<Database>,
  options: TableChangesOptions,
  onChange: () => void,
): () => void {
  const { channel: name, table, filter } = options;
  let hasSubscribed = false;
  channelSequence += 1;

  const channel = supabase
    .channel(`${name}:${channelSequence}`)
    .on("postgres_changes", { event: "*", schema: "public", table, filter }, onChange)
    .subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }
      if (hasSubscribed) {
        onChange();
      }
      hasSubscribed = true;
    });

  return () => {
    void supabase.removeChannel(channel);
  };
}
