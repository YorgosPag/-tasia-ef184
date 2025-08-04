"use client";

import type { PropertyPolygon as PropertyPolygonType } from "../types";

const statusColors = {
  'for-sale': '#10b981',
  'for-rent': '#3b82f6',
  'sold': '#ef4444',
  'rented': '#f97316',
  'reserved': '#eab308',
};

interface PropertyPolygonProps {
  property: PropertyPolygonType;
  isSelected: boolean;
  isHovered: boolean;
  isPolygonSelected: boolean;
  showLabels: boolean;
  isEditMode: boolean;
  onHover: (propertyId: string | null) => void;
  onSelect: (propertyId: string | null) => void;
}

export function PropertyPolygon({
  property,
  isSelected,
  isHovered,
  isPolygonSelected,
  showLabels,
  isEditMode,
  onHover,
  onSelect
}: PropertyPolygonProps) {
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

      {showLabels && (
        <g className="property-label">
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
        </g>
      )}

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
        </g>
      )}
    </g>
  );
}