"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADDRESS_MAX_LENGTH } from "@/features/restaurants/constants";
import { useAddressEditor } from "@/features/restaurants/hooks/use-address-editor";
import { AddressSuggestionList } from "./address-suggestion-list";

export interface AddressCardProps {
  readonly restaurantId: string;
  readonly currentAddress: string | null;
}

export function AddressCard({
  restaurantId,
  currentAddress,
}: AddressCardProps): ReactNode {
  const editor = useAddressEditor(restaurantId, currentAddress);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Adresse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Label htmlFor="restaurant-address">Rechercher votre adresse</Label>
        <Input
          id="restaurant-address"
          autoComplete="off"
          maxLength={ADDRESS_MAX_LENGTH}
          value={editor.query}
          placeholder="12 rue de Rivoli, Paris"
          onChange={(e) => editor.type(e.target.value)}
        />
        {editor.hasFailed ? (
          <p role="alert" className="text-destructive text-xs font-medium">
            La recherche d&apos;adresse est indisponible. Réessayez dans un instant.
          </p>
        ) : null}
        <AddressSuggestionList suggestions={editor.suggestions} onPick={editor.pick} />
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={!editor.canSave}
          onClick={editor.save}
        >
          {editor.isPending ? "Enregistrement…" : "Enregistrer l'adresse"}
        </Button>
      </CardContent>
    </Card>
  );
}
