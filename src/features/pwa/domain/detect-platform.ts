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

/** Android phones and tablets: Chrome's menu can always install, even without a prompt. */
export function isAndroidDevice({ userAgent }: PlatformSignals): boolean {
  return /Android/.test(userAgent);
}
