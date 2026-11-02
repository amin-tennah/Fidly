import type { CSSProperties, ReactNode } from "react";
import { BURST_PARTICLE_COUNT } from "@/features/loyalty/constants";

export interface PlusOneBurstProps {
  /** Card colour index, 1 to 6: half of the confetti uses its light tone. */
  readonly hue: number;
}

type ParticleStyle = CSSProperties & Record<`--${string}`, string>;

function particleStyle(index: number, hue: number): ParticleStyle {
  const isHue = index % 2 === 0;
  return {
    "--r": `${(360 / BURST_PARTICLE_COUNT) * index}deg`,
    backgroundColor: isHue ? `var(--hue-${hue}-dark)` : "var(--cream)",
  };
}

/** "+1" bubble and confetti played on top of the hero card when a stamp is added. Decorative. */
export function PlusOneBurst({ hue }: PlusOneBurstProps): ReactNode {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="bg-gain text-gain-foreground font-display animate-plus-up absolute top-4 right-4 rounded-full px-3 py-1 text-lg font-extrabold">
        +1
      </span>
      <div className="absolute top-1/2 left-1/2">
        {Array.from({ length: BURST_PARTICLE_COUNT }, (_, index) => (
          <span
            key={index}
            className="animate-burst absolute size-2 rounded-full"
            style={particleStyle(index, hue)}
          />
        ))}
      </div>
    </div>
  );
}
