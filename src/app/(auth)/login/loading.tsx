import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginStepsBand } from "@/features/auth";

/** Same cream frame, logo and forest band as the login screen; only the form is pending. */
export default function LoginLoading(): ReactNode {
  return (
    <div className="bg-background">
      <main
        aria-busy="true"
        className="pt-safe-14 pb-safe-7 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-[22px] px-6"
      >
        <BrandLogo tone="forest" width={230} className="mx-auto" />
        <LoginStepsBand />
        <Skeleton className="bg-primary/10 h-[58px] w-4/5" />
        <Skeleton className="h-14 w-full rounded-2xl bg-white" />
        <Skeleton className="h-14 w-full rounded-2xl bg-white" />
        <Skeleton className="bg-primary/85 h-14 w-full rounded-2xl" />
      </main>
    </div>
  );
}
