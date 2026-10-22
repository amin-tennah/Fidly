import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvitationLoading(): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 px-4 py-8">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-44 w-full rounded-xl" />
    </main>
  );
}
