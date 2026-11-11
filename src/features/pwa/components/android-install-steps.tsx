import { EllipsisVertical, SquarePlus } from "lucide-react";
import type { ReactNode } from "react";

/** Manual install on Android, when Chrome holds back its install prompt. */
export function AndroidInstallSteps(): ReactNode {
  return (
    <ol className="space-y-2 text-sm font-semibold">
      <li className="flex items-center gap-2">
        <EllipsisVertical aria-hidden="true" className="text-primary size-5 shrink-0" />
        <span>
          Touche le <strong className="font-extrabold">menu ⋮</strong> en haut à droite de
          Chrome
        </span>
      </li>
      <li className="flex items-center gap-2">
        <SquarePlus aria-hidden="true" className="text-primary size-5 shrink-0" />
        <span>
          Choisis <strong className="font-extrabold">Installer l&apos;appli</strong> ou{" "}
          <strong className="font-extrabold">
            Ajouter à l&apos;écran d&apos;accueil
          </strong>
        </span>
      </li>
    </ol>
  );
}
