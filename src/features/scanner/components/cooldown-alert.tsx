import { Clock } from "lucide-react";
import type { ReactNode } from "react";
import { SCAN_COOLDOWN_HOURS } from "@/features/scanner/constants";
import { formatCooldownRemaining } from "@/features/scanner/domain/format-cooldown";

interface CooldownAlertProps {
  readonly remainingSeconds: number;
}

/** The customer was credited less than 2 h ago: crediting again needs an explicit choice. */
export function CooldownAlert({ remainingSeconds }: CooldownAlertProps): ReactNode {
  return (
    <div
      role="alert"
      className="border-foreground bg-background flex gap-3 rounded-xl border-2 p-3 text-sm"
    >
      <Clock className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-bold">Déjà passé il y a moins de {SCAN_COOLDOWN_HOURS} h</p>
        <p>
          Délai restant : {formatCooldownRemaining(remainingSeconds)}. Créditer à nouveau
          sera tracé dans les logs.
        </p>
      </div>
    </div>
  );
}
