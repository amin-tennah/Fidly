import { Gift } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { SEGMENT_WAVE_STEP_MS } from "@/features/loyalty/constants";
import {
  buildSegmentRows,
  getSegmentColumns,
  type Segment,
} from "@/features/loyalty/domain/segment-rows";
import { cn } from "@/lib/utils";

export type SegmentedProgressTone = "card" | "list";

export interface SegmentedProgressProps {
  readonly count: number;
  readonly threshold: number;
  /** Card colour index, 1 to 6 (see getCardHue). */
  readonly hue: number;
  readonly justAdded?: boolean;
  /** "card": light tone on the forest hero card. "list": dark tone on white. */
  readonly tone?: SegmentedProgressTone;
}

type SegmentStyle = CSSProperties & Record<`--${string}`, string>;

const SIZE_CLASSES: Record<SegmentedProgressTone, string> = {
  card: "h-[22px] rounded-[7px]",
  list: "h-[17px] rounded-[6px]",
};

/** Column gap, then row gap when a tier needs a second row. */
const GAP_CLASSES: Record<SegmentedProgressTone, string> = {
  card: "gap-x-1 gap-y-1.5",
  list: "gap-x-[3px] gap-y-1",
};

const EMPTY_CLASSES: Record<SegmentedProgressTone, string> = {
  card: "bg-cream/16 border-cream/45 text-cream",
  list: "bg-track border-track text-(--seg)",
};

const FILLED_CLASSES: Record<SegmentedProgressTone, string> = {
  card: "bg-(--seg) border-(--seg) text-primary",
  list: "bg-(--seg) border-(--seg) text-white",
};

interface SegmentViewProps {
  readonly segment: Segment;
  readonly tone: SegmentedProgressTone;
  readonly animation: string | undefined;
  readonly delayMs: number;
}

function SegmentView({ segment, tone, animation, delayMs }: SegmentViewProps): ReactNode {
  const colors = segment.isFilled ? FILLED_CLASSES[tone] : EMPTY_CLASSES[tone];
  return (
    <span
      className={cn(
        "flex items-center justify-center border-2",
        SIZE_CLASSES[tone],
        colors,
        animation,
      )}
      style={delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {segment.isGift ? <Gift className="size-3.5" aria-hidden="true" /> : null}
    </span>
  );
}

interface PickAnimationInput {
  readonly segment: Segment;
  readonly isLastFilled: boolean;
  readonly isRewardReached: boolean;
  readonly justAdded: boolean;
}

function pickAnimation(input: PickAnimationInput): string | undefined {
  if (!input.justAdded || !input.segment.isFilled) {
    return undefined;
  }
  if (input.isRewardReached) {
    return "animate-seg-wave";
  }
  return input.isLastFilled ? "animate-seg-pop" : undefined;
}

interface SegmentsProps {
  readonly count: number;
  readonly threshold: number;
  readonly justAdded: boolean;
  readonly tone: SegmentedProgressTone;
}

function Segments({ count, threshold, justAdded, tone }: SegmentsProps): ReactNode {
  const filledCount = Math.min(count, threshold);
  return buildSegmentRows(count, threshold)
    .flat()
    .map((segment, index) => {
      const animation = pickAnimation({
        segment,
        isLastFilled: index === filledCount - 1,
        isRewardReached: count >= threshold,
        justAdded,
      });
      const isWave = animation === "animate-seg-wave";
      return (
        <SegmentView
          key={index}
          segment={segment}
          tone={tone}
          animation={animation}
          delayMs={isWave ? index * SEGMENT_WAVE_STEP_MS : 0}
        />
      );
    });
}

export function SegmentedProgress({
  count,
  threshold,
  hue,
  justAdded = false,
  tone = "list",
}: SegmentedProgressProps): ReactNode {
  const toneKey = tone === "card" ? "dark" : "light";
  // One grid for every row: an incomplete last row keeps the width of the first one.
  const style: SegmentStyle = {
    "--seg": `var(--hue-${hue}-${toneKey})`,
    gridTemplateColumns: `repeat(${getSegmentColumns(threshold)}, minmax(0, 1fr))`,
  };

  return (
    <div
      role="img"
      aria-label={`${count} / ${threshold} passages`}
      className={cn("grid", GAP_CLASSES[tone])}
      style={style}
    >
      <Segments count={count} threshold={threshold} justAdded={justAdded} tone={tone} />
    </div>
  );
}
