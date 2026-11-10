/**
 * In-app navigation depth, kept in module scope: it survives client-side navigation and
 * is reset by a full reload, exactly like the client router's history of this session.
 */
let forwardDepth = 0;

/** A forward step (e.g. home → card) was pushed on the history stack. */
export function markForwardNavigation(): void {
  forwardDepth += 1;
}

/** True when the previous history entry is a screen reached before a forward slide. */
export function hasInAppBackEntry(): boolean {
  return forwardDepth > 0;
}

/** A history entry was popped (phone button, gesture or in-app back). */
export function consumePop(): void {
  forwardDepth = Math.max(0, forwardDepth - 1);
}

/** Test helper: back to the state of a fresh page load. */
export function resetNavDirection(): void {
  forwardDepth = 0;
}
