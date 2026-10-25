import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CustomerProgress } from "@/features/scanner/components/customer-progress";
import type { DoneKind, ScanOutcome } from "@/features/scanner/types";

const SUCCESS_TITLES: Record<DoneKind, string> = {
  visit: "Passage validé",
  redeem: "Récompense validée",
  reverse: "Scan annulé",
};

interface ScanSuccessProps {
  readonly kind: DoneKind;
  readonly customerName: string;
  readonly outcome: ScanOutcome;
  readonly error: string | null;
  readonly isReversing: boolean;
  readonly onCancel: () => void;
}

export function ScanSuccess({
  kind,
  customerName,
  outcome,
  error,
  isReversing,
  onCancel,
}: ScanSuccessProps): ReactNode {
  return (
    <div className="space-y-4 p-4 pb-6">
      <div role="status" className="space-y-1 text-center">
        <p className="text-accent text-2xl font-bold">{SUCCESS_TITLES[kind]}</p>
        <p className="text-muted-foreground text-sm">{customerName}</p>
      </div>
      <CustomerProgress card={outcome} />
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        disabled={isReversing}
        onClick={onCancel}
      >
        {isReversing ? "Annulation…" : "Annuler ce scan"}
      </Button>
    </div>
  );
}
