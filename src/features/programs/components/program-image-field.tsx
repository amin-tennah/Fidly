"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RewardImage } from "@/components/shared/reward-image";
import { IMAGE_ASPECTS, ImageCropDialog, PickImageButton } from "@/features/media";
import { useProgramImage } from "@/features/programs/hooks/use-program-image";
import type { ProgramView } from "@/features/programs/types";

export interface ProgramImageFieldProps {
  readonly restaurantId: string;
  readonly program: ProgramView;
}

/** Optional reward picture of a tier: add or change (with framing), or remove. */
export function ProgramImageField({
  restaurantId,
  program,
}: ProgramImageFieldProps): ReactNode {
  const { flow, isBusy, remove } = useProgramImage(restaurantId, program.id);
  const title = `Image du palier ${program.position}`;
  const hasImage = program.rewardImageUrl !== null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Image de la récompense (facultatif)</p>
      <div className="flex items-center gap-3">
        <RewardImage url={program.rewardImageUrl} size="md" showPlaceholder />
        <div className="flex flex-1 flex-col gap-2">
          <PickImageButton
            title={title}
            label={hasImage ? "Changer l'image" : "Ajouter une image"}
            disabled={isBusy}
            onFile={flow.choose}
            className="w-full"
          />
          {hasImage ? (
            <Button type="button" variant="ghost" disabled={isBusy} onClick={remove}>
              Retirer l&apos;image
            </Button>
          ) : null}
        </div>
      </div>
      {flow.source ? (
        <ImageCropDialog
          imageUrl={flow.source.url}
          aspect={IMAGE_ASPECTS.reward}
          title={title}
          onCancel={flow.cancel}
          onConfirm={flow.confirm}
        />
      ) : null}
    </div>
  );
}
