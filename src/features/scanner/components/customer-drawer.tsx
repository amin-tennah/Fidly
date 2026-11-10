"use client";

import type { ReactNode } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { getCardHue } from "@/features/loyalty";
import { CustomerActions } from "@/features/scanner/components/customer-actions";
import { CustomerProgress } from "@/features/scanner/components/customer-progress";
import { ScanSuccess } from "@/features/scanner/components/scan-success";
import type { ScanFlow } from "@/features/scanner/hooks/use-scan-flow";

interface CustomerDrawerProps {
  readonly flow: ScanFlow;
  /** Gives the customer's card its colour (same hue as on the customer's phone). */
  readonly restaurantId: string;
}

function DrawerBody({ flow, restaurantId }: CustomerDrawerProps): ReactNode {
  const { state } = flow;
  if (state.step === "customer") {
    return (
      <div className="pb-safe-8 space-y-4 px-5">
        <CustomerProgress card={state.customer} hue={getCardHue(restaurantId)} />
        <CustomerActions
          customer={state.customer}
          error={state.error}
          isSubmitting={state.isSubmitting}
          onVisit={flow.validateVisit}
          onReward={flow.validateReward}
        />
      </div>
    );
  }
  if (state.step === "done") {
    return <ScanSuccess {...state} onCancel={flow.cancelLastScan} onNext={flow.close} />;
  }
  return null;
}

function drawerTitle(flow: ScanFlow): string {
  const { state } = flow;
  if (state.step === "customer") {
    return state.customer.displayName;
  }
  return state.step === "done" ? state.customerName : "Client";
}

export function CustomerDrawer({ flow, restaurantId }: CustomerDrawerProps): ReactNode {
  const { state } = flow;
  const isOpen = state.step === "customer" || state.step === "done";
  const isBusy = state.step === "customer" && state.isSubmitting;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && !isBusy && flow.close()}>
      <DrawerContent className="bg-cream">
        <DrawerHeader className={state.step === "done" ? "sr-only" : undefined}>
          <DrawerTitle className="text-2xl">{drawerTitle(flow)}</DrawerTitle>
          <DrawerDescription>Carte de fidélité du client</DrawerDescription>
        </DrawerHeader>
        <DrawerBody flow={flow} restaurantId={restaurantId} />
      </DrawerContent>
    </Drawer>
  );
}
