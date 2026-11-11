import type { ReactNode } from "react";
import { FormScreenSkeleton } from "@/components/shared/form-screen-skeleton";

const INVITATION_CARD_HEIGHT_PX = 176;

export default function InvitationLoading(): ReactNode {
  return <FormScreenSkeleton cardHeight={INVITATION_CARD_HEIGHT_PX} />;
}
