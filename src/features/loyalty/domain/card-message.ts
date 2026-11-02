import type { CardProgress } from "@/features/loyalty/types";

/** Short sentence under the progress segments (tone: 05-DIRECTION-ARTISTIQUE §7). */
export function describeCardMessage(progress: CardProgress): string {
  if (progress.isRewardUnlocked) {
    return "C'est gagné ! Montre cet écran en caisse.";
  }
  const remaining = progress.threshold - progress.stamps;
  const noun = remaining === 1 ? "passage" : "passages";
  return `Plus que ${remaining} ${noun} pour : ${progress.program.rewardLabel}`;
}
