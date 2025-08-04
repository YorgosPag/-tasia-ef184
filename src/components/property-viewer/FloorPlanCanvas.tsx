"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PropertyPolygon {
  id: string;
  name: string;
  type: string;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
  vertices: Array<{ x: number; y: number }>;
  color: string;
  price?: number;
  area?: number;
}

interface FloorData {
  id: string;
  name: string;
  level: number;
  buildingId: string;
  floorPlanUrl?: string;
  properties: PropertyPolygon[];
}

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

const statusColors = {
  'for-sale': '#10b981',    // Green
  'for-rent': '#3b82f6',    // Blue
  'sold': '#ef4444',        // Red
  'rented': '#f97316',      // Orange
  'reserved': '#eab308',    // Yellow
};

// Grid component
function GridOverlay({ showGrid, width, height }: { showGrid: boolean; width: number; height: number }) {
  if (!showGrid) return null;

  const gridSize = 20;
  const lines = [];

  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#e5e7eb"
        strokeWidth={0.5}
        opacity={0.5}
      />
    );
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth={0.5}
        opacity={0.5}
      />
    );
  }

  return <g className="grid-overlay">{lines}</g>;
}

// Property polygon component
function PropertyPolygon({
  property,
  isSelected,
  isHovered,
  isPolygonSelected,
  showLabels,
  isEditMode,
  onHover,
  onSelect
}: {
  property: PropertyPolygon;
  isSelected: boolean;
  isHovered: boolean;
  isPolygonSelected: boolean;
  showLabels: boolean;
  isEditMode: boolean;
  onHover: (propertyId: string | null) => void;
  onSelect: (propertyId: string | null) => void;
}) {
  const pathData = property.vertices
    .map((vertex, index) => `${index === 0 ? 'M' : 'L'} ${vertex.x} ${vertex.y}`)
    .join(' ') + ' Z';

  const centroid = property.vertices.reduce(
    (acc, vertex) => ({
      x: acc.x + vertex.x / property.vertices.length,
      y: acc.y + vertex.y / property.vertices.length
    }),
    { x: 0, y: 0 }
  );

  const fillColor = statusColors[property.status];
  let fillOpacity = 0.3;
  let strokeWidth = 1;
  let strokeColor = fillColor;

  // Visual states
  if (isSelected) {
    fillOpacity = 0.5;
    strokeWidth = 3;
    strokeColor = '#1f2937';
  } else if (isHovered) {
    fillOpacity = 0.4;
    strokeWidth = 2;
  } else if (isPolygonSelected) {
    fillOpacity = 0.6;
    strokeWidth = 2;
    strokeColor = '#7c3aed';
  }

  return (
    <g className="property-polygon">
      {/* Main polygon */}
      <path
        d={pathData}
        fill={fillColor}
        fillOpacity={fillOpacity}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={isEditMode ? "5,5" : "none"}
        className="cursor-pointer transition-all duration-200"
        onMouseEnter={() => onHover(property.id)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect(property.id)}
      />

      {/* Selection highlight */}
      {(isSelected || isPolygonSelected) && (
        <path
          d={pathData}
          fill="none"
          stroke={isPolygonSelected ? '#7c3aed' : '#1f2937'}
          strokeWidth={isPolygonSelected ? 3 : 2}
          strokeDasharray="3,3"
          opacity={0.8}
          className="pointer-events-none animate-pulse"
        />
      )}

      {/* Label */}
      {showLabels && (
        <g className="property-label">
          {/* Label background */}
          <rect
            x={centroid.x - 30}
            y={centroid.y - 10}
            width={60}
            height={20}
            fill="white"
            fillOpacity={0.9}
            stroke="#e5e7eb"
            strokeWidth={0.5}
            rx={2}
            className="pointer-events-none"
          />
          {/* Label text */}
          <text
            x={centroid.x}
            y={centroid.y + 3}
            textAnchor="middle"
            fontSize="10"
            fill="#374151"
            className="pointer-events-none select-none font-medium"
          >
            {property.name}
          </text>
          {/* Type text */}
          <text
            x={centroid.x}
            y={centroid.y + 15}
            textAnchor="middle"
            fontSize="8"
            fill="#6b7280"
            className="pointer-events-none select-none"
          >
            {property.type}
          </text>
        </g>
      )}

      {/* Hover tooltip */}
      {isHovered && (
        <g className="hover-tooltip">
          <rect
            x={centroid.x + 40}
            y={centroid.y - 25}
            width={120}
            height={50}
            fill="white"
            fillOpacity={0.95}
            stroke="#d1d5db"
            strokeWidth={1}
            rx={4}
            className="pointer-events-none drop-shadow-md"
          />
          <text
            x={centroid.x + 50}
            y={centroid.y - 15}
            fontSize="10"
            fill="#111827"
            className="pointer-events-none select-none font-semibold"
          >
            {property.name}
          </text>
          <text
            x={centroid.x + 50}
            y={centroid.y - 5}
            fontSize="9"
            fill="#6b7280"
            className="pointer-events-none select-none"
          >
            {property.type}
          </text>
          {property.price && (
            <text
              x={centroid.x + 50}
              y={centroid.y + 5}
              fontSize="9"
              fill="#059669"
              className="pointer-events-none select-none font-medium"
            >
              {property.price.toLocaleString('el-GR')}€
            </text>
          )}
          {property.area && (
            <text
              x={centroid.x + 50}
              y={centroid.y + 15}
              fontSize="8"
              fill="#6b7280"
              className="pointer-events-none select-none"
            >
              {property.area}τμ
            </text>
          )}
        </g>
      )}
    </g>
  );
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
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [creatingVertices, setCreatingVertices] = useState<Array<{ x: number; y: number }>>([]);

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({
          width: Math.max(offsetWidth, 400),
          height: Math.max(offsetHeight, 300)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (isCreatingPolygon) {
      const rect = event.currentTarget.getBoundingClientRect();
      const newVertex = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      setCreatingVertices((prev) => [...prev, newVertex]);
      console.log("Added vertex:", newVertex);
    } else if (event.target === event.currentTarget) {
      onPolygonSelect(null);
    }
  }, [isCreatingPolygon, onPolygonSelect]);
  
  const handleCanvasDoubleClick = useCallback(() => {
    if (isCreatingPolygon && creatingVertices.length >= 3) {
      onPolygonCreated(creatingVertices);
      setCreatingVertices([]);
    }
  }, [isCreatingPolygon, creatingVertices, onPolygonCreated]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    // Clear hover if moving over empty space
    if (event.target === event.currentTarget) {
      onPolygonHover(null);
    }
  }, [onPolygonHover]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden bg-card"
    >
      {/* Floor plan background */}
      {floorData.floorPlanUrl && (
        <div className="absolute inset-0 opacity-30">
          {/* PDF/DWG viewer would go here */}
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <span className="text-sm">Floor Plan: {floorData.name}</span>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 cursor-default"
        onClick={handleCanvasClick}
        onDoubleClick={handleCanvasDoubleClick}
        onMouseMove={handleCanvasMouseMove}
      >
        {/* Grid */}
        <GridOverlay 
          showGrid={showGrid}
          width={dimensions.width}
          height={dimensions.height}
        />

        {/* Properties */}
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

        {/* Creating polygon preview */}
        {isCreatingPolygon && creatingVertices.length > 0 && (
          <g className="creating-polygon">
            {/* Draw vertices */}
            {creatingVertices.map((vertex, index) => (
              <circle
                key={index}
                cx={vertex.x}
                cy={vertex.y}
                r={4}
                fill="#10b981"
                stroke="white"
                strokeWidth={2}
              />
            ))}
            
            {/* Draw connecting lines */}
            {creatingVertices.length > 1 && (
              <polyline
                points={creatingVertices.map(v => `${v.x},${v.y}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            )}
          </g>
        )}

        {/* Instructions */}
        {isCreatingPolygon && (
          <text x={20} y={40} fontSize="14" fill="#10b981" className="font-medium">
            Κάντε κλικ για να προσθέσετε κόμβους • Double-click για ολοκλήρωση
          </text>
        )}

        {/* Edit mode indicators */}
        {isEditMode && !isCreatingPolygon && (
          <g className="edit-indicators">
            <text
              x={20}
              y={30}
              fontSize="12"
              fill="#7c3aed"
              className="select-none font-medium"
            >
              ✏️ Λειτουργία Επεξεργασίας
            </text>
          </g>
        )}
      </svg>

      {/* Status legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
        <h4 className="text-xs font-medium mb-2">Κατάσταση Ακινήτων</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['for-sale'] }}></div>
            <span>Προς Πώληση</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['for-rent'] }}></div>
            <span>Προς Ενοικίαση</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['sold'] }}></div>
            <span>Πουλημένο</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['rented'] }}></div>
            <span>Ενοικιασμένο</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['reserved'] }}></div>
            <span>Δεσμευμένο</span>
          </div>
        </div>
      </div>

      {/* Property count */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border rounded-lg px-3 py-1 shadow-sm">
        <span className="text-xs text-muted-foreground">
          {floorData.properties.length} ακίνητα στον όροφο
        </span>
      </div>
    </div>
  );
}
