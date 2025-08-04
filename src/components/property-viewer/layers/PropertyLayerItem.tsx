"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Copy,
  Lock,
  Unlock,
  Home,
  Building,
  ChevronDown,
  ChevronRight,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PropertyPolygon } from "../types";

interface LayerState {
  visible: boolean;
  locked: boolean;
  opacity: number;
}

const statusConfig = {
  "for-sale": {
    label: "Προς Πώληση",
    color: "#10b981",
    bgColor: "bg-green-100 text-green-800 border-green-200",
  },
  "for-rent": {
    label: "Προς Ενοικίαση",
    color: "#3b82f6",
    bgColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  sold: {
    label: "Πουλημένο",
    color: "#ef4444",
    bgColor: "bg-red-100 text-red-800 border-red-200",
  },
  rented: {
    label: "Ενοικιασμένο",
    color: "#f97316",
    bgColor: "bg-orange-100 text-orange-800 border-orange-200",
  },
  reserved: {
    label: "Δεσμευμένο",
    color: "#eab308",
    bgColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
};

const propertyTypeIcons = {
  Στούντιο: Home,
  Γκαρσονιέρα: Home,
  "Διαμέρισμα 2Δ": Home,
  "Διαμέρισμα 3Δ": Home,
  Μεζονέτα: Building,
  Κατάστημα: Building,
  Αποθήκη: Building,
};

export function PropertyLayerItem({
  property,
  isSelected,
  layerState,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onOpacityChange,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  property: PropertyPolygon;
  isSelected: boolean;
  layerState: LayerState;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onOpacityChange: (opacity: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const statusInfo = statusConfig[property.status];
  const IconComponent =
    propertyTypeIcons[property.type as keyof typeof propertyTypeIcons] || Home;

  return (
    <div
      className={cn(
        "border rounded-lg p-3 space-y-2 transition-colors",
        isSelected ? "border-violet-200 bg-violet-50" : "border-border",
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>

        <div
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={onSelect}
        >
          <IconComponent className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate">{property.name}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onToggleVisibility}
          >
            {layerState.visible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onToggleLock}
          >
            {layerState.locked ? (
              <Lock className="h-3 w-3 text-muted-foreground" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Type and Status */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{property.type}</span>
        <Badge
          variant="outline"
          className={cn("text-xs", statusInfo.bgColor)}
        >
          {statusInfo.label}
        </Badge>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-3 pt-2 border-t">
          {/* Opacity */}
          <div className="space-y-1">
            <Label className="text-xs">
              Διαφάνεια: {Math.round(layerState.opacity * 100)}%
            </Label>
            <Slider
              value={[layerState.opacity * 100]}
              onValueChange={([value]) => onOpacityChange(value / 100)}
              max={100}
              step={10}
              className="w-full"
            />
          </div>

          {/* Properties */}
          {(property.price || property.area) && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {property.price && (
                <div>
                  <span className="text-muted-foreground">Τιμή:</span>
                  <div className="font-medium text-green-600">
                    {property.price.toLocaleString("el-GR")}€
                  </div>
                </div>
              )}
              {property.area && (
                <div>
                  <span className="text-muted-foreground">Εμβαδόν:</span>
                  <div className="font-medium">{property.area}τμ</div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-1 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs flex-1"
              onClick={onEdit}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Επεξ.
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs flex-1"
              onClick={onDuplicate}
            >
              <Copy className="h-3 w-3 mr-1" />
              Αντιγρ.
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
