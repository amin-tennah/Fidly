import { Gift } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { SEGMENTS_PER_ROW, SEGMENT_WAVE_STEP_MS } from "@/features/loyalty/constants";
import { buildSegmentRows, type Segment } from "@/features/loyalty/domain/segment-rows";
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

const GAP_CLASSES: Record<SegmentedProgressTone, string> = {
  card: "gap-1",
  list: "gap-[3px]",
};

const EMPTY_CLASSES: Record<SegmentedProgressTone, string> = {
  card: "bg-cream/16 border-cream/34 text-cream",
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
        "flex flex-1 items-center justify-center border-2",
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

interface SegmentRowViewProps {
  readonly row: readonly Segment[];
  readonly firstIndex: number;
  readonly filledCount: number;
  readonly isRewardReached: boolean;
  readonly justAdded: boolean;
  readonly tone: SegmentedProgressTone;
}

function SegmentRowView(props: SegmentRowViewProps): ReactNode {
  const { row, firstIndex, filledCount, isRewardReached, justAdded, tone } = props;
  return (
    <div className={cn("flex", GAP_CLASSES[tone])}>
      {row.map((segment, offset) => {
        const index = firstIndex + offset;
        const animation = pickAnimation({
          segment,
          isLastFilled: index === filledCount - 1,
          isRewardReached,
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
      })}
    </div>
  );
}

export function SegmentedProgress({
  count,
  threshold,
  hue,
  justAdded = false,
  tone = "list",
}: SegmentedProgressProps): ReactNode {
  const toneKey = tone === "card" ? "dark" : "light";
  const style: SegmentStyle = { "--seg": `var(--hue-${hue}-${toneKey})` };

  return (
    <div
      role="img"
      aria-label={`${count} / ${threshold} passages`}
      className={cn("flex flex-col", tone === "card" ? "gap-1.5" : "gap-1")}
      style={style}
    >
      {buildSegmentRows(count, threshold).map((row, rowIndex) => (
        <SegmentRowView
          key={rowIndex}
          row={row}
          firstIndex={rowIndex * SEGMENTS_PER_ROW}
          filledCount={Math.min(count, threshold)}
          isRewardReached={count >= threshold}
          justAdded={justAdded}
          tone={tone}
        />
      ))}
    </div>
  );
}
