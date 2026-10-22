import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  buildLoginPath,
  CLIENT_HOME_PATH,
  ONBOARDING_PATH,
  withNextParam,
} from "@/features/auth";
import {
  getAuthenticatedUser,
  getMyProfile,
} from "@/features/auth/queries/get-session-context";

interface ClientLayoutProps {
  readonly children: ReactNode;
}

export default async function ClientLayout({
  children,
}: ClientLayoutProps): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(CLIENT_HOME_PATH));
  }

  const profile = await getMyProfile(user.id);
  if (!profile?.displayName?.trim()) {
    redirect(withNextParam(ONBOARDING_PATH, CLIENT_HOME_PATH));
  }

  return <>{children}</>;
}
