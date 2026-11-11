import { Share, SquarePlus } from "lucide-react";
import type { ReactNode } from "react";

/** Manual install on iOS, where Safari offers no install prompt. */
export function IosInstallSteps(): ReactNode {
  return (
    <ol className="space-y-2 text-sm font-semibold">
      <li className="flex items-center gap-2">
        <Share aria-hidden="true" className="text-primary size-5 shrink-0" />
        <span>
          Touche <strong className="font-extrabold">Partager</strong> dans la barre de
          Safari
        </span>
      </li>
      <li className="flex items-center gap-2">
        <SquarePlus aria-hidden="true" className="text-primary size-5 shrink-0" />
        <span>
          Choisis{" "}
          <strong className="font-extrabold">Sur l&apos;écran d&apos;accueil</strong>
        </span>
      </li>
    </ol>
  );
}
