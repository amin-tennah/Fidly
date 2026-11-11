import type { ReactNode } from "react";
import type { InstallBenefitIcon } from "@/features/pwa/constants";

export interface BenefitIconProps {
  readonly name: InstallBenefitIcon;
  readonly className?: string;
}

/** A QR code: three finder squares and two modules. */
function QrShape(): ReactNode {
  return (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18z" fill="currentColor" stroke="none" />
    </>
  );
}

/** A loyalty card with its stamps, the last one still to earn. */
function CardsShape(): ReactNode {
  return (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M7 9.5h5" strokeLinecap="round" />
      <g fill="currentColor" stroke="none">
        <rect x="6.5" y="13" width="3" height="3" rx="1" />
        <rect x="10.5" y="13" width="3" height="3" rx="1" />
        <rect x="14.5" y="13" width="3" height="3" rx="1" opacity="0.35" />
      </g>
    </>
  );
}

/** A folded map of the neighbourhood (not a compass). */
function ShopsShape(): ReactNode {
  return (
    <>
      <path d="M3.5 6.5l5.2-2 6.6 2.5 5.2-2v12.5l-5.2 2-6.6-2.5-5.2 2z" />
      <path d="M8.7 4.5v12.5M15.3 7v12.5" strokeWidth="2" />
    </>
  );
}

const SHAPES: Record<InstallBenefitIcon, () => ReactNode> = {
  qr: QrShape,
  cards: CardsShape,
  shops: ShopsShape,
};

/** Rounded-line icons of the install benefits (06-DA-ITERATION-2 §4). Decorative. */
export function BenefitIcon({ name, className }: BenefitIconProps): ReactNode {
  const Shape = SHAPES[name];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
      className={className}
    >
      <Shape />
    </svg>
  );
}
