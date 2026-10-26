import type { ScanLogType } from "@/features/logs/types";

/** Short label of a journal line. */
export function describeLogType(type: ScanLogType): string {
  switch (type) {
    case "visit":
      return "Passage +1";
    case "reward_redeemed":
      return "Récompense";
    case "reversal":
      return "Annulation";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
