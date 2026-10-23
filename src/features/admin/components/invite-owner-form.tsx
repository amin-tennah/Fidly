"use client";

import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteOwner } from "@/features/admin/actions/admin-actions";

export interface InviteOwnerFormProps {
  readonly restaurantId: string;
  readonly onDone: () => void;
}

function useInviteOwner(
  restaurantId: string,
  onDone: () => void,
): {
  readonly email: string;
  readonly setEmail: (email: string) => void;
  readonly isPending: boolean;
  readonly submit: () => void;
} {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = (): void => {
    startTransition(async () => {
      const res = await inviteOwner({ restaurantId, email });
      if (res.ok) {
        toast.success(`Invitation créée pour ${email.trim().toLowerCase()}.`);
        onDone();
      } else {
        toast.error(res.error.message);
      }
    });
  };

  return { email, setEmail, isPending, submit };
}

/** Issues one more owner invitation for an existing restaurant. */
export function InviteOwnerForm({
  restaurantId,
  onDone,
}: InviteOwnerFormProps): ReactNode {
  const { email, setEmail, isPending, submit } = useInviteOwner(restaurantId, onDone);
  const inputId = `invite-${restaurantId}`;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>Email du gérant à inviter</Label>
      <Input
        id={inputId}
        type="email"
        inputMode="email"
        autoComplete="off"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onDone}>
          Annuler
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={isPending || email.trim() === ""}
          onClick={submit}
        >
          {isPending ? "Envoi…" : "Inviter"}
        </Button>
      </div>
    </div>
  );
}
