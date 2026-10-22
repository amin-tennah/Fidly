import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  buildLoginPath,
  CLIENT_HOME_PATH,
  INVITATION_PATH,
  type PendingRestaurantInvitation,
  PRO_HOME_PATH,
  type RestaurantMembershipSummary,
  SignOutButton,
} from "@/features/auth";
import {
  getAuthenticatedUser,
  getMyProfile,
  listMyPendingInvitations,
  listMyRestaurantMemberships,
} from "@/features/auth/queries/get-session-context";

interface ClientHeaderBannersProps {
  readonly invitations: readonly PendingRestaurantInvitation[];
  readonly memberships: readonly RestaurantMembershipSummary[];
}

function ClientHeaderBanners({
  invitations,
  memberships,
}: ClientHeaderBannersProps): ReactNode {
  return (
    <>
      {invitations.length > 0 ? (
        <Link
          href={INVITATION_PATH}
          className="block rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900"
        >
          Invitation restaurateur en attente ({invitations[0]?.restaurantName}) → Accepter
        </Link>
      ) : null}
      {memberships.length > 0 ? (
        <Link
          href={PRO_HOME_PATH}
          className="text-accent inline-block text-xs font-semibold underline-offset-4 hover:underline"
        >
          Accéder à l&apos;espace restaurateur ({memberships[0]?.restaurantName}) →
        </Link>
      ) : null}
    </>
  );
}

interface QrPreviewCardProps {
  readonly formattedCode: string;
}

function QrPreviewCard({ formattedCode }: QrPreviewCardProps): ReactNode {
  return (
    <Card aria-label="Aperçu du QR code client" className="my-6 items-center">
      <CardContent className="flex w-full flex-col items-center pt-2">
        <div className="border-border bg-muted/50 text-muted-foreground flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed text-center text-xs">
          QR code personnel
          <br />
          (Phase 4)
        </div>
        <p className="text-foreground mt-4 font-mono text-sm font-semibold tracking-widest">
          CODE : {formattedCode}
        </p>
        <div className="mt-5 w-full space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span>Progression exemple</span>
            <span className="text-accent font-semibold">7 / 10 passages</span>
          </div>
          <Progress value={70} aria-label="Exemple de progression fidélité" />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function HomePage(): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(CLIENT_HOME_PATH));
  }

  const [profile, memberships, invitations] = await Promise.all([
    getMyProfile(user.id),
    listMyRestaurantMemberships(user.id),
    listMyPendingInvitations(),
  ]);

  const formattedCode = profile?.shortCode
    ? `${profile.shortCode.slice(0, 3)} ${profile.shortCode.slice(3)}`
    : "--- ---";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-4 py-8">
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Fidly · Zéro Friction
          </span>
          <SignOutButton variant="ghost" size="sm" />
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Bonjour {profile?.displayName ?? ""}
        </h1>
        <p className="text-muted-foreground text-sm">
          Présentez votre QR code unique en caisse pour cumuler vos passages et débloquer
          vos récompenses en moins de 3 secondes.
        </p>
        <ClientHeaderBanners invitations={invitations} memberships={memberships} />
      </header>
      <QrPreviewCard formattedCode={formattedCode} />
      <footer className="text-muted-foreground text-center text-xs">
        Espace client Fidly · Phase 3
      </footer>
    </main>
  );
}
