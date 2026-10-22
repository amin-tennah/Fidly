import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  buildLoginPath,
  CLIENT_HOME_PATH,
  INVITATION_PATH,
  InvitationAcceptCard,
  ONBOARDING_PATH,
  type PendingRestaurantInvitation,
  SignOutButton,
  withNextParam,
} from "@/features/auth";
import {
  getAuthenticatedUser,
  getMyProfile,
  listMyPendingInvitations,
} from "@/features/auth/queries/get-session-context";

export const metadata: Metadata = {
  title: "Invitation restaurateur",
};

interface InvitationListProps {
  readonly invitations: readonly PendingRestaurantInvitation[];
}

function InvitationList({ invitations }: InvitationListProps): ReactNode {
  if (invitations.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6 text-sm">
          <p className="text-muted-foreground">
            Aucune invitation en attente pour cette adresse email. Vérifiez que vous êtes
            connecté avec l&apos;email communiqué à l&apos;équipe Fidly.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href={CLIENT_HOME_PATH}>Retour à mon espace client</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <InvitationAcceptCard key={invitation.invitationId} invitation={invitation} />
      ))}
    </div>
  );
}

export default async function InvitationPage(): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(INVITATION_PATH));
  }

  const profile = await getMyProfile(user.id);
  if (!profile?.displayName?.trim()) {
    redirect(withNextParam(ONBOARDING_PATH, INVITATION_PATH));
  }

  const invitations = await listMyPendingInvitations();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-4 py-8">
      <div className="space-y-6">
        <header className="space-y-1">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Espace Restaurateur Fidly
          </span>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Vos invitations en attente
          </h1>
          <p className="text-muted-foreground text-sm">
            Compte connecté : <span className="font-medium">{user.email}</span>
          </p>
        </header>
        <InvitationList invitations={invitations} />
      </div>
      <footer className="flex justify-center pt-4">
        <SignOutButton variant="ghost" />
      </footer>
    </main>
  );
}
