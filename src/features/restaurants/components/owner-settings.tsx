import type { ReactNode } from "react";
import type { RestaurantProfile } from "@/features/restaurants/types";
import { AddressCard } from "./address-card";
import { ImageUploadCard } from "./image-upload-card";
import { OpeningHoursCard } from "./opening-hours-card";
import { RestaurantIdentityCard } from "./restaurant-identity-card";

export interface OwnerSettingsProps {
  readonly profile: RestaurantProfile;
}

/** Every editable card of the restaurant profile (owner only). */
export function OwnerSettings({ profile }: OwnerSettingsProps): ReactNode {
  const { id } = profile;

  return (
    <div className="space-y-4">
      <RestaurantIdentityCard
        restaurantId={id}
        initialValues={{ name: profile.name, category: profile.category }}
      />
      <ImageUploadCard
        restaurantId={id}
        kind="logo"
        title="Logo"
        currentUrl={profile.logoUrl}
      />
      <ImageUploadCard
        restaurantId={id}
        kind="cover"
        title="Photo de couverture"
        currentUrl={profile.coverUrl}
      />
      <AddressCard restaurantId={id} currentAddress={profile.address} />
      <OpeningHoursCard restaurantId={id} initialHours={profile.openingHours} />
    </div>
  );
}
