"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export interface PickImageButtonProps {
  readonly title: string;
  readonly label: string;
  readonly disabled: boolean;
  readonly onFile: (file: File) => void;
  readonly className?: string;
}

/** Hands the chosen file over and resets the input so the same file can be picked again. */
function forwardFirstFile(
  event: ChangeEvent<HTMLInputElement>,
  onFile: (file: File) => void,
): void {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (file) {
    onFile(file);
  }
}

/** Button opening the OS file picker (JPEG, PNG, WebP), with an accessible hidden input. */
export function PickImageButton({
  title,
  label,
  disabled,
  onFile,
  className,
}: PickImageButtonProps): ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label={`Choisir : ${title}`}
        onChange={(event) => forwardFirstFile(event, onFile)}
      />
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={className}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </Button>
    </>
  );
}
