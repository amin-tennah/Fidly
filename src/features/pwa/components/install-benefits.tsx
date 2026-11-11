import type { ReactNode } from "react";
import { BenefitIcon } from "@/features/pwa/components/benefit-icon";
import { INSTALL_BENEFITS } from "@/features/pwa/constants";

/** The three things the installed app keeps at hand: same width, centred, split by a rule. */
export function InstallBenefits(): ReactNode {
  return (
    <ul className="divide-border grid grid-cols-3 divide-x py-1">
      {INSTALL_BENEFITS.map((benefit) => (
        <li
          key={benefit.icon}
          className="flex flex-col items-center gap-1.5 text-center text-xs leading-tight font-extrabold whitespace-nowrap"
        >
          <BenefitIcon
            name={benefit.icon}
            className="text-primary size-[26px] shrink-0"
          />
          {benefit.label}
        </li>
      ))}
    </ul>
  );
}
