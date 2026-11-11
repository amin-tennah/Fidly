"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CardCelebrations } from "@/features/loyalty/components/card-celebrations";
import { LoyaltyCardsList } from "@/features/loyalty/components/loyalty-cards-list";
import { buildPreviewCards } from "@/features/loyalty/preview-fixtures";

const PREVIEW_START_STAMPS = 5;
const PREVIEW_ALMOST_THERE_STAMPS = 9;

/**
 * Art-direction preview: made-up cards and buttons that change them the way a server read
 * would, so the celebrations can be watched and measured without an account. Only reachable
 * through the preview page, which is disabled unless DA_PREVIEW=1.
 */
export function CelebrationPreview(): ReactNode {
  const [cards, setCards] = useState(() => buildPreviewCards(PREVIEW_START_STAMPS));
  const stamps = cards[0]?.progress?.stamps ?? 0;
  const setStamps = (value: number): void => setCards(buildPreviewCards(value));

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" onClick={() => setStamps(stamps + 1)}>
          +1 passage
        </Button>
        <Button type="button" variant="outline" onClick={() => setStamps(stamps + 2)}>
          +2 passages
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setStamps(PREVIEW_ALMOST_THERE_STAMPS)}
        >
          Aller à 9
        </Button>
        <Button type="button" variant="outline" onClick={() => setStamps(stamps - 1)}>
          Annuler un passage
        </Button>
      </div>
      <LoyaltyCardsList cards={cards} />
      <CardCelebrations cards={cards} />
    </>
  );
}
