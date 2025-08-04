"use client";

interface PolygonCreationOverlayProps {
  vertices: Array<{ x: number; y: number }>;
}

export function PolygonCreationOverlay({ vertices }: PolygonCreationOverlayProps) {
  if (vertices.length === 0) return null;

  return (
    <g className="creating-polygon">
      {/* Draw vertices */}
      {vertices.map((vertex, index) => (
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
      {vertices.length > 1 && (
        <polyline
          points={vertices.map(v => `${v.x},${v.y}`).join(' ')}
          fill="none"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      )}
    </g>
  );
}