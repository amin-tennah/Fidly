import Image from "next/image";
import type { ReactNode } from "react";
import { RestaurantAvatar } from "@/components/shared/restaurant-avatar";
import { Card } from "@/components/ui/card";
import type { RestaurantProfile } from "@/features/restaurants/types";
import { HeroDetails } from "./hero-details";
import { ImageEditButton } from "./image-edit-button";

export interface RestaurantHeroProps {
  readonly profile: RestaurantProfile;
  readonly canEdit: boolean;
}

function Banner({ profile, canEdit }: RestaurantHeroProps): ReactNode {
  return (
    <div className="bg-secondary relative aspect-video w-full">
      {profile.coverUrl ? (
        <Image
          src={profile.coverUrl}
          alt=""
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
        />
      ) : null}
      {canEdit ? (
        <ImageEditButton
          restaurantId={profile.id}
          kind="cover"
          label="Changer la bannière"
          className="absolute right-3 bottom-3"
        />
      ) : null}
    </div>
  );
}

function Logo({ profile, canEdit }: RestaurantHeroProps): ReactNode {
  return (
    <div className="relative -mt-10 w-fit">
      <div className="ring-card rounded-full ring-4">
        <RestaurantAvatar name={profile.name} logoUrl={profile.logoUrl} size="xl" />
      </div>
      {canEdit ? (
        <ImageEditButton
          restaurantId={profile.id}
          kind="logo"
          label="Changer le logo"
          className="absolute -right-1 -bottom-1 size-9 after:absolute after:-inset-1.5 after:content-['']"
        />
      ) : null}
    </div>
  );
}

/** Banner, logo, name, category and address of the restaurant, with inline editing for the owner. */
export function RestaurantHero({ profile, canEdit }: RestaurantHeroProps): ReactNode {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <Banner profile={profile} canEdit={canEdit} />
      <div className="space-y-3 px-5 pb-5">
        <Logo profile={profile} canEdit={canEdit} />
        <HeroDetails profile={profile} canEdit={canEdit} />
      </div>
    </Card>
  );
}
