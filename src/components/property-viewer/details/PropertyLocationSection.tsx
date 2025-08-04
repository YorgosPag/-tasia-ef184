"use client";

import { Building, MapPin } from "lucide-react";
import type { PropertyDetails } from "./types";

export function PropertyLocationSection({ property }: { property: PropertyDetails }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs">
        <Building className="h-3 w-3 text-muted-foreground" />
        <span>{property.building}</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span>{property.floor >= 0 ? '+' : ''}{property.floor} όροφος</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{property.project}</span>
      </div>
    </div>
  );
}