import type { ReactNode } from "react";
import { AppIcon } from "@/features/pwa/components/app-icon";
import { HOME_SCREEN_APP_COLORS, HOME_SCREEN_SLOT_INDEX } from "@/features/pwa/constants";
import { cn } from "@/lib/utils";

export interface HomeScreenDropProps {
  /** False with reduced motion: the icon is already in its slot. */
  readonly isAnimated: boolean;
}

const APP_SIZE_PX = 56;
const APP_SHAPE = "size-14 rounded-[15px]";
const SPARK_PATH = "M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z";

/** What plays around the slot: it pulses, the icon lands, a ring and two sparks answer. */
function LandingEffects(): ReactNode {
  return (
    <>
      <span
        className={cn(
          "border-primary animate-slot absolute inset-0 border-2 border-dashed",
          APP_SHAPE,
        )}
      />
      <span
        className={cn(
          "border-gain animate-ripple absolute inset-0 border-[3px] [animation-delay:1150ms] [animation-duration:700ms]",
          APP_SHAPE,
        )}
      />
      <svg
        viewBox="0 0 24 24"
        className="text-primary animate-spark absolute -top-4 -left-4 size-[18px] fill-current [animation-delay:1300ms]"
      >
        <path d={SPARK_PATH} />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="text-hue-3-dark animate-spark absolute -top-2 left-[51px] size-3.5 fill-current [animation-delay:1400ms]"
      >
        <path d={SPARK_PATH} />
      </svg>
    </>
  );
}

/** The slot of the mock home screen where the Rézone icon lands, with its name below. */
function RezoneSlot({ isAnimated }: HomeScreenDropProps): ReactNode {
  return (
    <div className="relative size-14">
      {isAnimated ? <LandingEffects /> : null}
      <span className={cn("absolute inset-0", isAnimated && "animate-icon-drop")}>
        <AppIcon size={APP_SIZE_PX} className="drop-shadow-app-icon" />
      </span>
      <span
        className={cn(
          "text-primary absolute top-full left-1/2 mt-1 -translate-x-1/2 text-[10px] font-extrabold",
          isAnimated && "animate-fade-up [animation-delay:1500ms]",
        )}
      >
        Rézone
      </span>
    </div>
  );
}

/**
 * Mock home screen of the "installed" celebration (06-DA-ITERATION-2 §5): seven anonymous
 * apps and one empty slot, where the Rézone icon drops. Decorative.
 */
export function HomeScreenDrop({ isAnimated }: HomeScreenDropProps): ReactNode {
  const apps = [...HOME_SCREEN_APP_COLORS];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-cream rounded-screen shadow-overlay grid h-[182px] w-80 shrink-0 grid-cols-4 gap-3.5 p-7",
        isAnimated ? "animate-panel-in" : "reduced-fade",
      )}
    >
      {apps.slice(0, HOME_SCREEN_SLOT_INDEX).map((color) => (
        <span key={color} className={APP_SHAPE} style={{ backgroundColor: color }} />
      ))}
      <RezoneSlot isAnimated={isAnimated} />
      {apps.slice(HOME_SCREEN_SLOT_INDEX).map((color) => (
        <span key={color} className={APP_SHAPE} style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}
