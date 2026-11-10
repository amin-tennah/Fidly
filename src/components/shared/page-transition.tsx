import { ViewTransition, type ReactNode } from "react";
import { NAV_BACK, NAV_FORWARD } from "@/lib/navigation/constants";

export interface PageTransitionProps {
  /** One DOM element with an opaque background: it is the surface that slides. */
  readonly children: ReactNode;
}

/** Classes read by the `::view-transition-*` rules of globals.css. */
const ENTER = {
  [NAV_FORWARD]: "page-in-forward",
  [NAV_BACK]: "page-in-back",
  default: "none",
};
const EXIT = {
  [NAV_FORWARD]: "page-out-forward",
  [NAV_BACK]: "page-out-back",
  default: "none",
};

/**
 * Lateral slide between two screens of a journey (05-DIRECTION-ARTISTIQUE §5.4), built on
 * the browser's View Transitions: nothing moves in the layout, only snapshots do. Plays on
 * links typed "forward" or "back" (`ForwardLink`, `BackLink`); a history "back" is handled
 * by `NavDirectionListener`. Without browser support the screens swap instantly. Not for
 * the bottom tabs.
 */
export function PageTransition({ children }: PageTransitionProps): ReactNode {
  return (
    <ViewTransition enter={ENTER} exit={EXIT} default="none">
      {children}
    </ViewTransition>
  );
}
