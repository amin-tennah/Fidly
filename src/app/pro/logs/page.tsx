import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { SectionTitle } from "@/components/shared/section-title";
import { CLIENT_HOME_PATH } from "@/features/auth";
import { getAuthenticatedUser } from "@/features/auth/queries/get-session-context";
import { ScanLogsLive } from "@/features/logs";
import { fetchScanLogPage } from "@/features/logs/queries/fetch-scan-log-page";
import { getActiveMembership } from "@/features/restaurants/queries/get-active-membership";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Logs",
};

export default async function ProLogsPage(): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  const active = user ? await getActiveMembership(user.id) : null;
  if (!active) {
    redirect(CLIENT_HOME_PATH);
  }

  const supabase = await createSupabaseServerClient();
  const initialPage = await fetchScanLogPage(supabase, active.restaurantId, null);

  return (
    <section aria-labelledby="logs-heading" className="space-y-3">
      <SectionTitle id="logs-heading">Journal des scans</SectionTitle>
      {/* `key` resets the list when the owner switches restaurant. */}
      <ScanLogsLive
        key={active.restaurantId}
        restaurantId={active.restaurantId}
        initialPage={initialPage}
      />
    </section>
  );
}
