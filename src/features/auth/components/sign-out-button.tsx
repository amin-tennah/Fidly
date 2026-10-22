"use client";

import type { ReactNode } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import { signOutUser } from "@/features/auth/actions/profile-and-invitation-actions";
import { LOGIN_PATH } from "@/features/auth/constants";
import { clearStoredIdentity } from "@/features/auth/identity-storage";

export interface SignOutButtonProps {
  readonly variant?: ButtonProps["variant"];
  readonly size?: ButtonProps["size"];
  readonly className?: string;
}

export function SignOutButton({
  variant = "outline",
  size = "sm",
  className,
}: SignOutButtonProps): ReactNode {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = (): void => {
    startTransition(async () => {
      const res = await signOutUser();
      if (!res.ok) {
        toast.error(res.error.message);
        return;
      }
      clearStoredIdentity();
      router.replace(LOGIN_PATH);
      router.refresh();
    });
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={isPending}
      onClick={handleSignOut}
    >
      {isPending ? "Déconnexion…" : "Se déconnecter"}
    </Button>
  );
}
