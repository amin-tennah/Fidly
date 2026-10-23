import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ComingSoonCardProps {
  readonly title: string;
  readonly description: string;
}

/** Placeholder for a screen delivered by a later roadmap phase. */
export function ComingSoonCard({ title, description }: ComingSoonCardProps): ReactNode {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">{description}</CardContent>
    </Card>
  );
}
