"use client";

import type { ReactNode } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CustomerActions } from "@/features/scanner/components/customer-actions";
import { CustomerProgress } from "@/features/scanner/components/customer-progress";
import { ScanSuccess } from "@/features/scanner/components/scan-success";
import type { ScanFlow } from "@/features/scanner/hooks/use-scan-flow";

interface CustomerDrawerProps {
  readonly flow: ScanFlow;
}

function DrawerBody({ flow }: CustomerDrawerProps): ReactNode {
  const { state } = flow;
  if (state.step === "customer") {
    return (
      <div className="space-y-4 p-4 pb-6">
        <CustomerProgress card={state.customer} />
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
    return <ScanSuccess {...state} onCancel={flow.cancelLastScan} />;
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

export function CustomerDrawer({ flow }: CustomerDrawerProps): ReactNode {
  const { state } = flow;
  const isOpen = state.step === "customer" || state.step === "done";
  const isBusy = state.step === "customer" && state.isSubmitting;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && !isBusy && flow.close()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-2xl">{drawerTitle(flow)}</DrawerTitle>
          <DrawerDescription>Carte de fidélité du client</DrawerDescription>
        </DrawerHeader>
        <DrawerBody flow={flow} />
      </DrawerContent>
    </Drawer>
  );
}
