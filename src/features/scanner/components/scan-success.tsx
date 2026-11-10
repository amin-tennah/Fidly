import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { DoneKind, ScanOutcome } from "@/features/scanner/types";

const SUCCESS_TITLES: Record<DoneKind, string> = {
  visit: "Validé",
  redeem: "Récompense remise",
  reverse: "Scan annulé",
};

interface ScanSuccessProps {
  readonly kind: DoneKind;
  readonly customerName: string;
  readonly outcome: ScanOutcome;
  readonly error: string | null;
  readonly isReversing: boolean;
  readonly onCancel: () => void;
  readonly onNext: () => void;
}

interface SuccessActionsProps {
  readonly isReversing: boolean;
  readonly onCancel: () => void;
  readonly onNext: () => void;
}

function SuccessActions({
  isReversing,
  onCancel,
  onNext,
}: SuccessActionsProps): ReactNode {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        size="lg"
        className="border-primary text-base"
        disabled={isReversing}
        onClick={onCancel}
      >
        {isReversing ? "Annulation…" : "Annuler"}
      </Button>
      <Button size="lg" className="text-base" disabled={isReversing} onClick={onNext}>
        Scanner suivant
      </Button>
    </div>
  );
}

export function ScanSuccess({
  kind,
  customerName,
  outcome,
  error,
  isReversing,
  onCancel,
  onNext,
}: ScanSuccessProps): ReactNode {
  return (
    <div className="pb-safe-8 space-y-4 px-5">
      <div role="status" className="flex items-center gap-4">
        <span className="bg-primary text-gain flex size-[72px] shrink-0 items-center justify-center rounded-full">
          <Check className="size-10" strokeWidth={4} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[38px] leading-none font-extrabold tracking-[-0.02em]">
            {SUCCESS_TITLES[kind]}
          </p>
          <p className="mt-1 text-base font-semibold">
            {customerName} · passage {outcome.stamps} sur {outcome.threshold}
          </p>
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
      <SuccessActions isReversing={isReversing} onCancel={onCancel} onNext={onNext} />
    </div>
  );
}
