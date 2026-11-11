export interface PlatformSignals {
  readonly userAgent: string;
  readonly maxTouchPoints: number;
}

/**
 * iPhone, iPod and iPad. Since iPadOS 13 an iPad announces itself as a Mac: only its touch
 * screen tells them apart.
 */
export function isIosDevice({ userAgent, maxTouchPoints }: PlatformSignals): boolean {
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return true;
  }
  return /Macintosh/.test(userAgent) && maxTouchPoints > 1;
}
