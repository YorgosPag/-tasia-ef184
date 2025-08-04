"use client";

import { Building, MapPin } from "lucide-react";
import type { PropertyHoverData } from "./types";

export function HoverLocationSection({
  property,
}: {
  property: PropertyHoverData;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs">
        <Building className="h-3 w-3 text-muted-foreground" />
        <span>{property.building}</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span>
          {property.floor === 0
            ? "Ισόγειο"
            : property.floor < 0
              ? "Υπόγειο"
              : `${property.floor}ος όροφος`}
        </span>
      </div>
    </div>
  );
}
