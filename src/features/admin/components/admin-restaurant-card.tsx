"use client";

import { UserPlus } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatShortDate } from "@/features/admin/domain/format-date";
import type { AdminRestaurantRow } from "@/features/admin/types";
import { EaselDownloadButton } from "./easel-download-button";
import { InviteOwnerForm } from "./invite-owner-form";

export interface AdminRestaurantCardProps {
  readonly restaurant: AdminRestaurantRow;
  readonly appUrl: string;
}

function OwnershipLines({
  restaurant,
}: {
  readonly restaurant: AdminRestaurantRow;
}): ReactNode {
  const { ownerNames, pendingInvitations } = restaurant;
  return (
    <div className="space-y-1 text-sm">
      <p>
        {ownerNames.length > 0
          ? `Gérant : ${ownerNames.join(", ")}`
          : "Aucun gérant rattaché"}
      </p>
      {pendingInvitations.map((invitation) => (
        <p
          key={`${invitation.email}-${invitation.expiresAt}`}
          className="text-muted-foreground text-[13px]"
        >
          Invitation en attente : {invitation.email} (jusqu&apos;au{" "}
          {formatShortDate(invitation.expiresAt)})
        </p>
      ))}
    </div>
  );
}

export function AdminRestaurantCard({
  restaurant,
  appUrl,
}: AdminRestaurantCardProps): ReactNode {
  const [isInviting, setIsInviting] = useState(false);

  return (
    <Card>
      <div className="space-y-0.5">
        <h3 className="text-base font-extrabold">{restaurant.name}</h3>
        <p className="text-muted-foreground text-[13px]">
          {restaurant.categoryLabel} ·{" "}
          <span className="font-mono">{restaurant.slug}</span>
        </p>
      </div>
      <OwnershipLines restaurant={restaurant} />
      {isInviting ? (
        <InviteOwnerForm
          restaurantId={restaurant.id}
          onDone={() => setIsInviting(false)}
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setIsInviting(true)}>
            <UserPlus className="size-4" aria-hidden="true" />
            Inviter un gérant
          </Button>
          <EaselDownloadButton
            name={restaurant.name}
            slug={restaurant.slug}
            appUrl={appUrl}
          />
        </div>
      )}
    </Card>
  );
}
