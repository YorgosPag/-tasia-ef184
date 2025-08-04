"use client";

import { Euro, Home, Ruler } from "lucide-react";
import type { PropertyDetails } from "./types";

export function PropertySpecsSection({ property }: { property: PropertyDetails }) {
  return (
    <div className="space-y-2">
      {property.price && (
        <div className="flex items-center gap-2 text-sm">
          <Euro className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-green-600">
            {property.price.toLocaleString('el-GR')}€
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        {property.area && (
          <div className="flex items-center gap-1">
            <Ruler className="h-3 w-3 text-muted-foreground" />
            <span>{property.area}τμ</span>
          </div>
        )}
        {property.rooms && (
          <div className="flex items-center gap-1">
            <Home className="h-3 w-3 text-muted-foreground" />
            <span>{property.rooms} δωμ.</span>
          </div>
        )}
      </div>
    </div>
  );
}