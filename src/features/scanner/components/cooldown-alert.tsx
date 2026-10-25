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
      className="rounded-xl border border-amber-500/50 bg-amber-50 p-3 text-sm text-amber-900"
    >
      <p className="font-semibold">
        Déjà crédité il y a moins de {SCAN_COOLDOWN_HOURS} h
      </p>
      <p>
        Délai restant : {formatCooldownRemaining(remainingSeconds)}. Créditer à nouveau
        sera tracé dans les logs.
      </p>
    </div>
  );
}
