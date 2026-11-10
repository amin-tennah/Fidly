import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface CashierViewProps {
  readonly restaurantName: string;
  readonly onClose: () => void;
  readonly camera: ReactNode;
  /** Cream bottom sheet: notices and the manual code form. */
  readonly sheet: ReactNode;
}

/** Full-screen cashier layout (05b §6): ink background, camera zone, cream sheet. No decorative animation. */
export function CashierView({
  restaurantName,
  onClose,
  camera,
  sheet,
}: CashierViewProps): ReactNode {
  return (
    <div className="bg-foreground text-cream fixed inset-0 z-[45] flex flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <header className="pt-safe-5 flex items-center justify-between gap-3 px-5">
          <h1 className="font-display text-[22px] font-extrabold">Scanner</h1>
          <div className="flex min-w-0 items-center gap-1">
            <p className="truncate text-sm font-semibold">{restaurantName}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Fermer la caméra"
              className="text-cream hover:text-cream shrink-0 hover:bg-white/10"
              onClick={onClose}
            >
              <X className="size-6" aria-hidden="true" />
            </Button>
          </div>
        </header>
        <div className="mt-4 px-5">{camera}</div>
        <div className="bg-cream text-foreground pb-safe-8 mt-auto space-y-3 rounded-t-[28px] px-5 pt-5">
          {sheet}
        </div>
      </div>
    </div>
  );
}
