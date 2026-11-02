import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Step {
  readonly id: string;
  readonly node: ReactNode;
}

export interface StepTransitionProps {
  /** Steps in forward order: a step before the active one recedes left, one after waits on the right. */
  readonly steps: readonly Step[];
  readonly activeId: string;
}

const TRANSITION =
  "transition-[translate,visibility] duration-[var(--dur-slide),0s] ease-(--ease-slide)";

function placementClass(index: number, activeIndex: number): string {
  if (index === activeIndex) {
    return cn(TRANSITION, "visible translate-x-0 delay-0");
  }
  const side = index < activeIndex ? "-translate-x-[28%]" : "translate-x-full";
  return cn(TRANSITION, side, "invisible delay-[0s,var(--dur-slide)]");
}

/**
 * Slide transition between steps of a flow (05-DIRECTION-ARTISTIQUE §5.4). All steps are
 * stacked in one grid cell; inactive ones are inert and hidden once the slide ends.
 */
export function StepTransition({ steps, activeId }: StepTransitionProps): ReactNode {
  const activeIndex = steps.findIndex((step) => step.id === activeId);

  return (
    <div className="grid overflow-x-clip">
      {steps.map((step, index) => (
        <div
          key={step.id}
          inert={index !== activeIndex}
          className={cn("col-start-1 row-start-1", placementClass(index, activeIndex))}
        >
          {step.node}
        </div>
      ))}
    </div>
  );
}
