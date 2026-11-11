/**
 * "The client home is on screen" flag, shared between the home page (which sets it) and
 * the intro splash mounted in the root layout (which waits for it).
 */
let isHomeReady = false;
const listeners = new Set<() => void>();

export function setHomeReady(value: boolean): void {
  if (isHomeReady === value) {
    return;
  }
  isHomeReady = value;
  listeners.forEach((listener) => listener());
}

export function subscribeHomeReady(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getHomeReady(): boolean {
  return isHomeReady;
}

/** Server render: the home content is never "ready" before hydration. */
export function getServerHomeReady(): boolean {
  return false;
}
