"use client";

import { useRef, useEffect } from "react";
import { useCanvasDimensions } from "./hooks/useCanvasDimensions";
import { useCanvasInteractions } from "./hooks/useCanvasInteractions";
import { GridOverlay } from "./canvas/GridOverlay";
import { PropertyPolygon } from "./canvas/PropertyPolygon";
import { PolygonCreationOverlay } from "./canvas/PolygonCreationOverlay";
import { StatusLegend } from "./canvas/StatusLegend";
import { CanvasInstructions, EditModeBanner } from "./canvas/CanvasOverlays";
import type { FloorData, PropertyPolygon as PropertyPolygonType } from "./types";

interface FloorPlanCanvasProps {
  floorData: FloorData;
  selectedProperty: string | null;
  hoveredProperty: string | null;
  selectedPolygon: string | null;
  showGrid: boolean;
  showLabels: boolean;
  isEditMode: boolean;
  onPolygonHover: (propertyId: string | null) => void;
  onPolygonSelect: (propertyId: string | null) => void;
  isCreatingPolygon: boolean;
  onPolygonCreated: (vertices: Array<{ x: number; y: number }>) => void;
}

export function FloorPlanCanvas({
  floorData,
  selectedProperty,
  hoveredProperty,
  selectedPolygon,
  showGrid,
  showLabels,
  isEditMode,
  onPolygonHover,
  onPolygonSelect,
  isCreatingPolygon,
  onPolygonCreated,
}: FloorPlanCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { dimensions } = useCanvasDimensions(containerRef);
  const { 
    handleCanvasClick, 
    handleCanvasDoubleClick,
    handleCanvasMouseMove,
    creatingVertices
  } = useCanvasInteractions({
    isCreatingPolygon,
    onPolygonCreated,
    onPolygonSelect,
    onPolygonHover,
  });

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden bg-card"
    >
      {/* Floor plan background */}
      {floorData.floorPlanUrl && (
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <span className="text-sm">Floor Plan: {floorData.name}</span>
          </div>
        </div>
      )}

      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 cursor-default"
        onClick={handleCanvasClick}
        onDoubleClick={handleCanvasDoubleClick}
        onMouseMove={handleCanvasMouseMove}
      >
        <GridOverlay 
          showGrid={showGrid}
          width={dimensions.width}
          height={dimensions.height}
        />

        {floorData.properties.map((property) => (
          <PropertyPolygon
            key={property.id}
            property={property}
            isSelected={selectedProperty === property.id}
            isHovered={hoveredProperty === property.id}
            isPolygonSelected={selectedPolygon === property.id}
            showLabels={showLabels}
            isEditMode={isEditMode}
            onHover={onPolygonHover}
            onSelect={onPolygonSelect}
          />
        ))}

        {isCreatingPolygon && (
          <>
            <PolygonCreationOverlay vertices={creatingVertices} />
            <CanvasInstructions />
          </>
        )}

        {isEditMode && !isCreatingPolygon && <EditModeBanner />}
      </svg>
      
      <StatusLegend />

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border rounded-lg px-3 py-1 shadow-sm">
        <span className="text-xs text-muted-foreground">
          {floorData.properties.length} ακίνητα στον όροφο
        </span>
      </div>
    </div>
  );
}