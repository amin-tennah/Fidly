"use client";

import { MapPin, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RESTAURANT_CATEGORY_LABELS } from "@/features/restaurants/constants";
import type { RestaurantProfile } from "@/features/restaurants/types";
import { AddressEditor } from "./address-editor";
import { RestaurantIdentityForm } from "./restaurant-identity-form";

export interface HeroDetailsProps {
  readonly profile: RestaurantProfile;
  readonly canEdit: boolean;
}

type EditedBlock = "identity" | "address" | null;

function EditButton({
  label,
  onClick,
}: {
  readonly label: string;
  readonly onClick: () => void;
}): ReactNode {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={onClick}
    >
      <Pencil className="size-4" aria-hidden="true" />
    </Button>
  );
}

function Identity({
  profile,
  canEdit,
  onEdit,
}: HeroDetailsProps & { readonly onEdit: () => void }): ReactNode {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 space-y-1">
        <h2 className="text-xl leading-tight font-bold">{profile.name}</h2>
        <span className="bg-secondary text-secondary-foreground inline-block rounded-full px-2.5 py-0.5 text-xs font-medium">
          {RESTAURANT_CATEGORY_LABELS[profile.category]}
        </span>
      </div>
      {canEdit ? (
        <EditButton label="Modifier le nom et la catégorie" onClick={onEdit} />
      ) : null}
    </div>
  );
}

function Address({
  profile,
  canEdit,
  onEdit,
}: HeroDetailsProps & { readonly onEdit: () => void }): ReactNode {
  return (
    <div className="flex items-start justify-between gap-2">
      <p className="flex min-w-0 items-start gap-2 text-sm">
        <MapPin
          className="text-muted-foreground mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        />
        <span className={profile.address ? undefined : "text-muted-foreground"}>
          {profile.address ?? "Adresse non renseignée"}
        </span>
      </p>
      {canEdit ? <EditButton label="Modifier l'adresse" onClick={onEdit} /> : null}
    </div>
  );
}

/** Name, category and address; each one swaps for its inline editor (one at a time). */
export function HeroDetails({ profile, canEdit }: HeroDetailsProps): ReactNode {
  const [edited, setEdited] = useState<EditedBlock>(null);
  const close = (): void => setEdited(null);

  return (
    <div className="space-y-3">
      {edited === "identity" ? (
        <RestaurantIdentityForm
          restaurantId={profile.id}
          initialValues={{ name: profile.name, category: profile.category }}
          onDone={close}
        />
      ) : (
        <Identity
          profile={profile}
          canEdit={canEdit}
          onEdit={() => setEdited("identity")}
        />
      )}
      {edited === "address" ? (
        <AddressEditor
          restaurantId={profile.id}
          currentAddress={profile.address}
          onDone={close}
        />
      ) : (
        <Address
          profile={profile}
          canEdit={canEdit}
          onEdit={() => setEdited("address")}
        />
      )}
    </div>
  );
}
