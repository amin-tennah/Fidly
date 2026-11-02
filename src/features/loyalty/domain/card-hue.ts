import { CARD_HUE_COUNT } from "@/features/loyalty/constants";

/** Index (1 to CARD_HUE_COUNT) of the colour of a restaurant's card. FNV-1a hash, stable across sessions. */
export function getCardHue(restaurantId: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < restaurantId.length; i += 1) {
    hash ^= restaurantId.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return ((hash >>> 0) % CARD_HUE_COUNT) + 1;
}
