import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading(): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-8">
      <div className="space-y-4">
        <Skeleton className="mx-auto h-6 w-32" />
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </main>
  );
}
