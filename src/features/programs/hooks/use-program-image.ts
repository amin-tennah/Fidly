"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useImageUploadFlow, type ImageUploadFlow } from "@/features/media";
import {
  removeProgramImage,
  uploadProgramImage,
} from "@/features/programs/actions/program-image-actions";

export interface ProgramImage {
  readonly flow: ImageUploadFlow;
  readonly isBusy: boolean;
  readonly remove: () => void;
}

/** Upload (crop included) and removal of the reward image of one tier. */
export function useProgramImage(restaurantId: string, programId: string): ProgramImage {
  const [isRemoving, startRemoval] = useTransition();
  const flow = useImageUploadFlow((image) => {
    const formData = new FormData();
    formData.set("restaurantId", restaurantId);
    formData.set("programId", programId);
    formData.set("file", image, "image");
    return uploadProgramImage(formData);
  });

  const remove = (): void => {
    startRemoval(async () => {
      const res = await removeProgramImage({ restaurantId, programId });
      if (res.ok) {
        toast.success("Image retirée.");
      } else {
        toast.error(res.error.message);
      }
    });
  };

  return { flow, isBusy: flow.isPending || isRemoving, remove };
}
