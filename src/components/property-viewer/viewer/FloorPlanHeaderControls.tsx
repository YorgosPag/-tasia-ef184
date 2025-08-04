"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Upload,
  Save,
  Grid,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import type { FloorData } from "../types";

interface FloorPlanHeaderControlsProps {
  currentFloorId: string;
  floors: FloorData[];
  zoom: number;
  showGrid: boolean;
  showLabels: boolean;
  isEditMode: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleGrid: () => void;
  onToggleLabels: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onSelectFloor: (floorId: string) => void;
  onCreateProperty: () => void;
}

export function FloorPlanHeaderControls({
  currentFloorId,
  floors,
  zoom,
  showGrid,
  showLabels,
  isEditMode,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  onToggleLabels,
  onUpload,
  onSave,
  onSelectFloor,
  onCreateProperty,
}: FloorPlanHeaderControlsProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={currentFloorId} onValueChange={onSelectFloor}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Επιλέξτε όροφο" />
            </SelectTrigger>
            <SelectContent>
              {floors.map((floor) => (
                <SelectItem key={floor.id} value={floor.id}>
                  {floor.name} ({floor.level >= 0 ? "+" : ""}
                  {floor.level})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-xs">
            {floors.find((f) => f.id === currentFloorId)?.properties.length || 0}{" "}
            ακίνητα
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <Button
              onClick={onCreateProperty}
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Νέο Ακίνητο
            </Button>
          )}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button variant="ghost" size="sm" onClick={onZoomOut} className="h-8 w-8 p-0" title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs px-2 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="sm" onClick={onZoomIn} className="h-8 w-8 p-0" title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={onResetZoom} className="h-8 w-8 p-0" title="Reset View">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button variant={showGrid ? "secondary" : "ghost"} size="sm" onClick={onToggleGrid} className="h-8 w-8 p-0" title="Toggle Grid">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={showLabels ? "secondary" : "ghost"} size="sm" onClick={onToggleLabels} className="h-8 w-8 p-0" title="Toggle Labels">
              {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <input type="file" accept=".pdf,.dwg,.dxf" onChange={onUpload} className="hidden" id="floor-plan-upload"/>
            <Button variant="outline" size="sm" onClick={() => document.getElementById("floor-plan-upload")?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Φόρτωση
            </Button>
            {isEditMode && (
              <Button variant="outline" size="sm" onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Αποθήκευση
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
