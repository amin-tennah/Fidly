import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  readonly title: string;
  readonly description?: string;
  readonly onRetry: () => void;
  /** "screen" fills the viewport; "inline" fits inside a layout that already has its frame. */
  readonly layout?: "screen" | "inline";
}

const DEFAULT_DESCRIPTION =
  "Un souci est survenu de notre côté. Réessaie dans un instant.";

const LAYOUT_CLASSES = {
  screen: "pt-safe-8 pb-safe-8 mx-auto min-h-dvh w-full max-w-md px-5",
  inline: "flex-1 py-8",
} as const;

/** Error with a retry action, used by the route `error.tsx` files. */
export function ErrorState({
  title,
  description = DEFAULT_DESCRIPTION,
  onRetry,
  layout = "screen",
}: ErrorStateProps): ReactNode {
  const Frame = layout === "screen" ? "main" : "div";
  return (
    <Frame
      className={cn(
        "flex flex-col items-center justify-center gap-5 text-center",
        LAYOUT_CLASSES[layout],
      )}
    >
      <span className="bg-secondary text-primary flex size-16 items-center justify-center rounded-full">
        <TriangleAlert className="size-8" aria-hidden="true" />
      </span>
      <h1 className="font-display text-xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
      <Button type="button" size="lg" onClick={onRetry}>
        Réessayer
      </Button>
    </Frame>
  );
}
