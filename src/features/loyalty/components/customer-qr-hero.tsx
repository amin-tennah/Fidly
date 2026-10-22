"use client";

import { QRCodeSVG } from "qrcode.react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { type StoredIdentity, usePersistIdentity } from "@/features/auth";
import {
  QR_BACKGROUND_COLOR,
  QR_FOREGROUND_COLOR,
  QR_QUIET_ZONE_MODULES,
  QR_SIZE_PX,
} from "@/features/loyalty/constants";
import { formatShortCode } from "@/features/loyalty/domain/format-short-code";

export interface CustomerQrHeroProps {
  readonly identity: StoredIdentity;
}

/** Personal QR (opaque `qr_token`, ADR-005/013) with the backup short code below. */
export function CustomerQrHero({ identity }: CustomerQrHeroProps): ReactNode {
  usePersistIdentity(identity);

  return (
    <Card aria-label="Votre QR code personnel" className="items-center">
      <CardContent className="flex w-full flex-col items-center gap-4">
        <div
          role="img"
          aria-label="QR code personnel à présenter en caisse"
          className="rounded-xl bg-white p-1 shadow-xs ring-1 ring-black/5"
        >
          <QRCodeSVG
            value={identity.qrToken}
            size={QR_SIZE_PX}
            level="M"
            marginSize={QR_QUIET_ZONE_MODULES}
            bgColor={QR_BACKGROUND_COLOR}
            fgColor={QR_FOREGROUND_COLOR}
          />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-muted-foreground text-xs">
            Code de secours si le QR est illisible
          </p>
          <p className="text-foreground font-mono text-xl font-bold tracking-widest">
            {formatShortCode(identity.shortCode)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
