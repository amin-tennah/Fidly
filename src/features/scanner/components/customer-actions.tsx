import { Gift } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CooldownAlert } from "@/features/scanner/components/cooldown-alert";
import type { CustomerLookup } from "@/features/scanner/types";

interface CustomerActionsProps {
  readonly customer: CustomerLookup;
  readonly error: string | null;
  readonly isSubmitting: boolean;
  readonly onVisit: () => void;
  readonly onReward: () => void;
}

interface RewardButtonProps {
  readonly isSubmitting: boolean;
  readonly onReward: () => void;
}

function RewardButton({ isSubmitting, onReward }: RewardButtonProps): ReactNode {
  return (
    <Button
      variant="gain"
      size="lg"
      className="min-h-16 w-full text-lg"
      disabled={isSubmitting}
      onClick={onReward}
    >
      <Gift className="size-5" aria-hidden="true" />
      Valider la récompense
    </Button>
  );
}

/** Large one-hand buttons for the till; disabled while a request is in flight. */
export function CustomerActions({
  customer,
  error,
  isSubmitting,
  onVisit,
  onReward,
}: CustomerActionsProps): ReactNode {
  return (
    <div className="space-y-3">
      {customer.isInCooldown ? (
        <CooldownAlert remainingSeconds={customer.cooldownRemainingSeconds} />
      ) : null}
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
      {customer.isRewardUnlocked ? (
        <RewardButton isSubmitting={isSubmitting} onReward={onReward} />
      ) : null}
      <Button
        variant={customer.isInCooldown ? "outline" : "default"}
        size="lg"
        className="min-h-16 w-full text-lg"
        disabled={isSubmitting}
        onClick={onVisit}
      >
        {customer.isInCooldown ? "Créditer malgré le délai" : "Valider +1 passage"}
      </Button>
    </div>
  );
}
