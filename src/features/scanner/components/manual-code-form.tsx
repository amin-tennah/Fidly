"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SHORT_CODE_LENGTH } from "@/features/scanner/constants";

interface ManualCodeFormProps {
  readonly isDisabled: boolean;
  readonly onSubmit: (code: string) => void;
}

/** Fallback when the QR cannot be read: the 6-character code shown on the customer's phone. */
export function ManualCodeForm({ isDisabled, onSubmit }: ManualCodeFormProps): ReactNode {
  const [code, setCode] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (code.trim()) {
      onSubmit(code);
      setCode("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-secondary rounded-card space-y-2 p-4">
      <Label htmlFor="manual-code" className="text-sm font-extrabold">
        Code du client
      </Label>
      <div className="flex gap-2">
        <Input
          id="manual-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          maxLength={SHORT_CODE_LENGTH + 2}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="ex. K7M-2PQ"
          className="min-h-14 min-w-0 flex-1 rounded-2xl bg-white font-mono tracking-widest uppercase"
        />
        <Button
          type="submit"
          size="lg"
          className="disabled:text-muted-foreground disabled:bg-disabled disabled:opacity-100"
          disabled={isDisabled || !code.trim()}
        >
          Chercher
        </Button>
      </div>
    </form>
  );
}
