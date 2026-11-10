import type { ReactNode } from "react";
import { FormScreenSkeleton } from "@/components/shared/form-screen-skeleton";

const CREATE_RESTAURANT_CARD_HEIGHT_PX = 320;

export default function AdminLoading(): ReactNode {
  return <FormScreenSkeleton cardHeight={CREATE_RESTAURANT_CARD_HEIGHT_PX} />;
}
