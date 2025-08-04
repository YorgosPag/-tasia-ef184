"use client";

import { Euro, Ruler } from "lucide-react";
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

export function HoverPricingSection({
  property,
}: {
  property: PropertyHoverData;
}) {
  const statusInfo = statusConfig[property.status];
  if (!property.price && !property.area) return null;
  return (
    <div className="space-y-2">
      {property.price && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {statusInfo.priceLabel}:
          </p>
          <div className="flex items-center gap-1">
            <Euro className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-sm text-green-600">
              {property.price.toLocaleString("el-GR")}€
              {(property.status === "for-rent" ||
                property.status === "rented") && (
                <span className="text-xs text-muted-foreground">/μήνα</span>
              )}
            </span>
          </div>
        </div>
      )}

      {property.area && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Εμβαδόν:</p>
          <div className="flex items-center gap-1">
            <Ruler className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium">{property.area}τμ</span>
          </div>
        </div>
      )}

      {/* Price per square meter */}
      {property.price && property.area && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Τιμή ανά τμ:</p>
          <span className="text-xs font-medium">
            {Math.round(property.price / property.area).toLocaleString("el-GR")}
            €/τμ
            {(property.status === "for-rent" ||
              property.status === "rented") && "/μήνα"}
          </span>
        </div>
      )}
    </div>
  );
}
