"use client";

import type { ReactNode } from "react";
import { PlusOneBurst } from "@/features/loyalty/components/plus-one-burst";
import {
  SegmentedProgress,
  type SegmentedProgressProps,
} from "@/features/loyalty/components/segmented-progress";
import { useJustAdded } from "@/features/loyalty/hooks/use-just-added";

/** Segments of a card in the list, with the "+1" celebration when Realtime brings a new stamp. */
export function LoyaltyCardProgress(
  props: Omit<SegmentedProgressProps, "justAdded">,
): ReactNode {
  const justAdded = useJustAdded(props.count);

  return (
    <div className="relative">
      <SegmentedProgress {...props} justAdded={justAdded} />
      {justAdded ? <PlusOneBurst hue={props.hue} /> : null}
    </div>
  );
}
