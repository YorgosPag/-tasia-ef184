"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PropertyHoverData, StatusConfig } from "./types";

const statusConfig: Record<PropertyHoverData["status"], StatusConfig> = {
  "for-sale": {
    label: "Προς Πώληση",
    color: "bg-green-100 text-green-800 border-green-200",
    priceLabel: "Τιμή Πώλησης",
  },
  "for-rent": {
    label: "Προς Ενοικίαση",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    priceLabel: "Μηνιαίο Μίσθωμα",
  },
  sold: {
    label: "Πουλημένο",
    color: "bg-red-100 text-red-800 border-red-200",
    priceLabel: "Τιμή Πώλησης",
  },
  rented: {
    label: "Ενοικιασμένο",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    priceLabel: "Μηνιαίο Μίσθωμα",
  },
  reserved: {
    label: "Δεσμευμένο",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    priceLabel: "Τιμή Πώλησης",
  },
};

export function HoverHeaderSection({
  property,
}: {
  property: PropertyHoverData;
}) {
  const statusInfo = statusConfig[property.status];
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm leading-tight">{property.name}</h4>
        <Badge
          variant="outline"
          className={cn("text-xs flex-shrink-0", statusInfo.color)}
        >
          {statusInfo.label}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{property.type}</p>
    </div>
  );
}
