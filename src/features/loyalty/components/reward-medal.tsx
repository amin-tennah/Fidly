import { Gift } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RewardMedalProps {
  /** Text engraved on the medal, e.g. "10 / 10". */
  readonly label: string;
  /** False with reduced motion: the medal is simply there, without rays or sparkles. */
  readonly isAnimated: boolean;
}

/** Four-point stars around the medal: position in the 220 px wide medal box, size, start. */
const SPARKLES = [
  { left: -22, top: -30, size: 34, delayMs: 1700, color: "text-cream" },
  { left: 212, top: 10, size: 26, delayMs: 2000, color: "text-gain" },
  { left: 180, top: -56, size: 22, delayMs: 2300, color: "text-cream" },
  { left: -14, top: 236, size: 22, delayMs: 2600, color: "text-gain" },
] as const;

const RIBBONS = [
  { side: "left-[50px] rotate-[10deg]", color: "bg-cream", delayMs: 1600 },
  { side: "left-[120px] -rotate-[10deg]", color: "bg-gain", delayMs: 1700 },
] as const;

function delay(delayMs: number): CSSProperties {
  return { animationDelay: `${delayMs}ms` };
}

function Sparkles(): ReactNode {
  return SPARKLES.map((sparkle) => (
    <svg
      key={sparkle.delayMs}
      viewBox="0 0 24 24"
      className={cn("animate-twinkle absolute fill-current", sparkle.color)}
      style={{
        left: sparkle.left,
        top: sparkle.top,
        width: sparkle.size,
        height: sparkle.size,
        ...delay(sparkle.delayMs),
      }}
    >
      <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" />
    </svg>
  ));
}

function Ribbons({ isAnimated }: Pick<RewardMedalProps, "isAnimated">): ReactNode {
  return RIBBONS.map((ribbon) => (
    <span
      key={ribbon.delayMs}
      className={cn("absolute top-[150px] h-[150px] w-[50px] origin-top", ribbon.side)}
    >
      <span
        className={cn(
          "ribbon-tail block size-full origin-top",
          ribbon.color,
          isAnimated && "animate-ribbon",
        )}
        style={isAnimated ? delay(ribbon.delayMs) : undefined}
      />
    </span>
  ));
}

/**
 * Lime medal of the "Récompense disponible" celebration (06-DA-ITERATION-2 §3): it spins
 * like a coin, its ribbons unfold, rays turn slowly behind it. Decorative.
 */
export function RewardMedal({ label, isAnimated }: RewardMedalProps): ReactNode {
  return (
    <div
      aria-hidden="true"
      className="relative h-[300px] w-[220px] shrink-0 perspective-[700px]"
    >
      {isAnimated ? (
        <span className="medal-rays animate-rays absolute top-[-150px] left-[-150px] size-[520px] rounded-full" />
      ) : null}
      <Ribbons isAnimated={isAnimated} />
      <div
        className={cn(
          "bg-gain shadow-medal absolute top-0 left-0 flex size-[220px] items-center justify-center rounded-full",
          isAnimated && "animate-spin-coin",
        )}
      >
        <div className="border-primary text-primary flex size-[176px] flex-col items-center justify-center gap-0.5 rounded-full border-[3px] border-dashed">
          <Gift className="size-[72px]" strokeWidth={2} />
          <span className="font-display text-[34px] leading-none font-extrabold">
            {label}
          </span>
        </div>
      </div>
      {isAnimated ? <Sparkles /> : null}
    </div>
  );
}
