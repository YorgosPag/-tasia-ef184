"use client";

import { MousePointer } from "lucide-react";

export function HoverInstructionSection() {
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <MousePointer className="h-3 w-3" />
      <span>Κάντε κλικ για περισσότερες πληροφορίες</span>
    </div>
  );
}
