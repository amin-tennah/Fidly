import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ScanLogsFooterProps {
  readonly hasMore: boolean;
  readonly isLoadingMore: boolean;
  readonly error: string | null;
  readonly onLoadMore: () => void;
}

/** Error line and « Charger plus » under the list. */
export function ScanLogsFooter({
  hasMore,
  isLoadingMore,
  error,
  onLoadMore,
}: ScanLogsFooterProps): ReactNode {
  return (
    <>
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
      {hasMore ? (
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoadingMore}
          onClick={onLoadMore}
        >
          {isLoadingMore ? "Chargement…" : "Charger plus"}
        </Button>
      ) : null}
    </>
  );
}
