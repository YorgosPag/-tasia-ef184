"use client";

import { useState, useCallback } from "react";
import { FloorPlanHeaderControls } from "./viewer/FloorPlanHeaderControls";
import { FloorCanvasWrapper } from "./viewer/FloorCanvasWrapper";
import { EditSidebar } from "./viewer/EditSidebar";
import { useZoom } from "@/hooks/useZoom";
import { usePolygonCreator } from "@/hooks/usePolygonCreator";
import type { FloorData, PropertyPolygon } from "./types";
import { FloorPlanCanvas } from "./FloorPlanCanvas";

interface FloorPlanViewerProps {
  selectedProperty: string | null;
  selectedFloor: string | null;
  onSelectFloor: (floorId: string) => void;
  onHoverProperty: (propertyId: string | null) => void;
  hoveredProperty: string | null;
  isEditMode: boolean;
  mockFloors: FloorData[];
}

export function FloorPlanViewer({
  selectedProperty,
  selectedFloor,
  onSelectFloor,
  onHoverProperty,
  hoveredProperty,
  isEditMode,
  mockFloors,
}: FloorPlanViewerProps) {
  const { zoom, zoomIn, zoomOut, reset } = useZoom();
  const { isCreatingPolygon, startCreatingPolygon, handlePolygonCreated } =
    usePolygonCreator();
  const [selectedPolygon, setSelectedPolygon] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const currentFloor =
    mockFloors.find((f) => f.id === selectedFloor) || mockFloors[0];

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        console.log("Uploading floor plan:", file.name);
      }
    },
    [],
  );

  const handleSave = useCallback(() => {
    console.log("Save changes");
  }, []);

  return (
    <div className="h-full flex flex-col bg-card border rounded-lg shadow-sm">
      <FloorPlanHeaderControls
        currentFloorId={currentFloor.id}
        floors={mockFloors}
        zoom={zoom}
        showGrid={showGrid}
        showLabels={showLabels}
        isEditMode={isEditMode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={reset}
        onToggleGrid={() => setShowGrid((v) => !v)}
        onToggleLabels={() => setShowLabels((v) => !v)}
        onUpload={handleFileUpload}
        onSave={handleSave}
        onSelectFloor={onSelectFloor}
        onCreateProperty={startCreatingPolygon}
      />
      <div className="flex-1 flex overflow-hidden">
        <FloorCanvasWrapper zoom={zoom}>
          <FloorPlanCanvas
            floorData={currentFloor}
            selectedProperty={selectedProperty}
            hoveredProperty={hoveredProperty}
            selectedPolygon={selectedPolygon}
            showGrid={showGrid}
            showLabels={showLabels}
            isEditMode={isEditMode}
            onPolygonHover={onHoverProperty}
            onPolygonSelect={setSelectedPolygon}
            isCreatingPolygon={isCreatingPolygon}
            onPolygonCreated={handlePolygonCreated}
          />
        </FloorCanvasWrapper>
        {isEditMode && (
          <EditSidebar
            floorData={currentFloor}
            selectedPolygon={selectedPolygon}
            onPolygonSelect={setSelectedPolygon}
          />
        )}
      </div>
    </div>
  );
}
