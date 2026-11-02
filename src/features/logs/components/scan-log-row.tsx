import type { ReactNode } from "react";
import { describeLogType } from "@/features/logs/domain/describe-log-type";
import { formatLogTime } from "@/features/logs/domain/format-log-time";
import type { ScanLogEntry } from "@/features/logs/types";
import { cn } from "@/lib/utils";

interface ScanLogRowProps {
  readonly entry: ScanLogEntry;
}

function Badges({ entry }: ScanLogRowProps): ReactNode {
  return (
    <>
      {entry.isCooldownOverridden ? (
        <span className="border-foreground bg-background rounded-full border-2 px-2 py-0.5 text-xs font-bold">
          Délai de 2 h dépassé
        </span>
      ) : null}
      {entry.isReversed && entry.reversedAt ? (
        <span className="bg-secondary rounded-full px-2 py-0.5 text-xs font-medium">
          Annulé{entry.reversedByName ? ` par ${entry.reversedByName}` : ""} ·{" "}
          {formatLogTime(entry.reversedAt)}
        </span>
      ) : null}
    </>
  );
}

/** A reversed line stays readable (struck through): the journal is an audit trail. */
export function ScanLogRow({ entry }: ScanLogRowProps): ReactNode {
  const customer = entry.customerName ?? "Client supprimé";
  const staff = entry.staffName ?? "Ancien employé";

  return (
    <li
      className={cn(
        "bg-card border-border space-y-1.5 rounded-xl border p-3",
        entry.isReversed && "text-muted-foreground",
      )}
    >
      <p className={cn("font-semibold", entry.isReversed && "line-through")}>
        {describeLogType(entry.type)} · {customer}
      </p>
      <p
        className={cn(
          "text-muted-foreground text-xs",
          entry.isReversed && "line-through",
        )}
      >
        <time dateTime={entry.createdAt}>{formatLogTime(entry.createdAt)}</time> · {staff}{" "}
        · {entry.rewardLabel}
      </p>
      <div className="flex flex-wrap gap-1.5 empty:hidden">
        <Badges entry={entry} />
      </div>
    </li>
  );
}
