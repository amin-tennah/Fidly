"use client";

import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { acceptRestaurantInvitation } from "@/features/auth/actions/profile-and-invitation-actions";
import { PRO_HOME_PATH } from "@/features/auth/constants";
import type { PendingRestaurantInvitation } from "@/features/auth/types";

export interface InvitationAcceptCardProps {
  readonly invitation: PendingRestaurantInvitation;
}

function InvitationHeader({ invitation }: InvitationAcceptCardProps): ReactNode {
  const roleLabel =
    invitation.memberRole === "owner" ? "Gérant (owner)" : "Équipier (staff)";
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-base">{invitation.restaurantName}</CardTitle>
      <p className="text-muted-foreground text-xs">Rôle attribué : {roleLabel}</p>
    </CardHeader>
  );
}

interface AcceptActionBodyProps {
  readonly errorMessage: string | null;
  readonly isPending: boolean;
  readonly onAccept: () => void;
}

function AcceptActionBody({
  errorMessage,
  isPending,
  onAccept,
}: AcceptActionBodyProps): ReactNode {
  return (
    <CardContent className="space-y-3">
      {errorMessage ? (
        <p role="alert" className="text-destructive text-xs font-medium">
          {errorMessage}
        </p>
      ) : null}
      <Button
        type="button"
        variant="accent"
        size="lg"
        className="w-full"
        disabled={isPending}
        onClick={onAccept}
      >
        {isPending ? "Activation en cours…" : "Accepter l'invitation"}
      </Button>
    </CardContent>
  );
}

export function InvitationAcceptCard({
  invitation,
}: InvitationAcceptCardProps): ReactNode {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAccept = (): void => {
    setErrorMessage(null);
    startTransition(async () => {
      const id = invitation.invitationId;
      const res = await acceptRestaurantInvitation({ invitationId: id });
      if (!res.ok) {
        setErrorMessage(res.error.message);
        return;
      }
      router.replace(PRO_HOME_PATH);
      router.refresh();
    });
  };

  return (
    <Card>
      <InvitationHeader invitation={invitation} />
      <AcceptActionBody
        errorMessage={errorMessage}
        isPending={isPending}
        onAccept={handleAccept}
      />
    </Card>
  );
}
