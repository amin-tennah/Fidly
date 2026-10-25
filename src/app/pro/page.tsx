import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { CLIENT_HOME_PATH } from "@/features/auth";
import { getAuthenticatedUser } from "@/features/auth/queries/get-session-context";
import { getActiveMembership } from "@/features/restaurants/queries/get-active-membership";
import { ScannerScreen } from "@/features/scanner";

export const metadata: Metadata = {
  title: "Scanner",
};

export default async function ProScannerPage(): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  const active = user ? await getActiveMembership(user.id) : null;
  if (!active) {
    redirect(CLIENT_HOME_PATH);
  }

  // `key` resets the flow (and its idempotency keys) when the owner switches restaurant.
  return <ScannerScreen key={active.restaurantId} restaurantId={active.restaurantId} />;
}
