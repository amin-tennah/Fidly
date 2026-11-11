import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { LOGIN_STEPS } from "@/features/auth/constants";

/** Forest block with the three promises: lime discs joined by lime dashes. */
export function LoginStepsBand(): ReactNode {
  return (
    <ol className="bg-primary flex h-[150px] items-start justify-center gap-2 rounded-3xl px-4 pt-[26px]">
      {LOGIN_STEPS.map((label, index) => (
        <li key={label} className="flex items-start gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="bg-gain mt-8 h-[3px] w-5 rounded-full" />
          ) : null}
          <div className="flex w-[72px] flex-col items-center gap-2.5">
            <span className="bg-gain text-gain-foreground font-display flex size-16 items-center justify-center rounded-full text-3xl font-extrabold">
              {index === LOGIN_STEPS.length - 1 ? (
                <Check className="size-8" strokeWidth={4} aria-hidden="true" />
              ) : (
                <span aria-hidden="true">{index + 1}</span>
              )}
            </span>
            <span className="text-primary-foreground font-display text-[15px] font-bold">
              {label}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
