"use client";

import { addTransitionType, startTransition, useEffect, type ReactNode } from "react";
import { NAV_BACK } from "@/lib/navigation/constants";
import { consumePop, hasInAppBackEntry } from "@/lib/navigation/nav-direction";

const VIEW_TRANSITION_API = "startViewTransition";

/**
 * Route slides are only played on Chromium browsers (`navigator.userAgentData` exists
 * there alone). Measured on the WebKit test build: after a slide, a history "back" crashes
 * the page, while without view transitions it never does.
 */
function isChromium(): boolean {
  return "userAgentData" in window.navigator;
}

/** Hides the View Transitions API: React then swaps the screens instantly, as before. */
function disableViewTransitions(): void {
  if (VIEW_TRANSITION_API in document) {
    Reflect.defineProperty(document, VIEW_TRANSITION_API, {
      value: undefined,
      configurable: true,
    });
  }
}

/** Hands the history entry back to the router inside a transition typed "back". */
function replayAsBack(state: unknown, markReplaying: (value: boolean) => void): void {
  // Outside the native event, which would make the router update synchronous.
  window.setTimeout(() => {
    startTransition(() => {
      addTransitionType(NAV_BACK);
      markReplaying(true);
      window.dispatchEvent(new PopStateEvent("popstate", { state }));
      markReplaying(false);
    });
  }, 0);
}

/**
 * A history "back" (phone button, gesture, in-app back) reaches the router without a
 * transition type, and the router applies it synchronously: the screen would jump. When
 * the entry being left was reached by a forward slide, this intercepts the event and
 * replays it typed "back", so that `PageTransition` plays the reverse slide.
 * Outside Chromium nothing slides (on iOS the edge swipe is animated by the system).
 */
export function NavDirectionListener(): ReactNode {
  useEffect(() => {
    if (!isChromium()) {
      disableViewTransitions();
      return;
    }
    let isReplaying = false;

    const handlePop = (event: PopStateEvent): void => {
      if (isReplaying) {
        return;
      }
      const isSlideBack = hasInAppBackEntry();
      consumePop();
      if (!isSlideBack) {
        return;
      }
      event.stopImmediatePropagation();
      replayAsBack(event.state, (value) => {
        isReplaying = value;
      });
    };

    // Capture: runs before the router's own listener, registered on the same target.
    window.addEventListener("popstate", handlePop, { capture: true });
    return () => window.removeEventListener("popstate", handlePop, { capture: true });
  }, []);

  return null;
}
