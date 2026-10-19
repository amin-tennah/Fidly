import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">): ReactNode {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground border-border flex flex-col gap-4 rounded-xl border p-5 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">): ReactNode {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"div">): ReactNode {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-tight font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: ComponentProps<"div">): ReactNode {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">): ReactNode {
  return <div data-slot="card-content" className={cn("", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">): ReactNode {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center pt-2", className)}
      {...props}
    />
  );
}
