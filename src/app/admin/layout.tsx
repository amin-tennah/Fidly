import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ADMIN_HOME_PATH, buildLoginPath, CLIENT_HOME_PATH } from "@/features/auth";
import {
  getAuthenticatedUser,
  isUserPlatformAdmin,
} from "@/features/auth/queries/get-session-context";

interface AdminLayoutProps {
  readonly children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(ADMIN_HOME_PATH));
  }

  const isAdmin = await isUserPlatformAdmin(user.id);
  if (!isAdmin) {
    redirect(CLIENT_HOME_PATH);
  }

  return <>{children}</>;
}
