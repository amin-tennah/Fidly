import type { ReactNode } from "react";
import { LOGIN_STEPS } from "@/features/auth/constants";

/** Forest band with the three promises of the app, as lime pills. */
export function LoginStepsBand(): ReactNode {
  return (
    <ol className="bg-primary flex items-center justify-center gap-2 rounded-2xl px-3 py-3">
      {LOGIN_STEPS.map((label, index) => (
        <li
          key={label}
          className="bg-gain text-gain-foreground font-display flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
        >
          <span aria-hidden="true">{index + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}
