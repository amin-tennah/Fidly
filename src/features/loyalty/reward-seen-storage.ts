import { REWARD_SEEN_STORAGE_KEY } from "@/features/loyalty/constants";
import type { RewardCelebration } from "@/features/loyalty/types";

/** Fallback when sessionStorage is unavailable: the medal still plays once per page. */
const seenOnThisPage = new Set<string>();

/** One reward = one card on one tier. */
export function getRewardKey(celebration: RewardCelebration): string {
  return `${celebration.cardId}:${celebration.progress.program.id}`;
}

function readStoredKeys(): string[] {
  try {
    const parsed: unknown = JSON.parse(
      window.sessionStorage.getItem(REWARD_SEEN_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    // Blocked or corrupted storage: only the in-memory set is known.
    return [];
  }
}

export function hasSeenReward(key: string): boolean {
  return seenOnThisPage.has(key) || readStoredKeys().includes(key);
}

export function markRewardSeen(key: string): void {
  seenOnThisPage.add(key);
  try {
    const keys = new Set([...readStoredKeys(), key]);
    window.sessionStorage.setItem(REWARD_SEEN_STORAGE_KEY, JSON.stringify([...keys]));
  } catch {
    // Intentionally ignored: without storage the in-memory set above still holds.
  }
}
