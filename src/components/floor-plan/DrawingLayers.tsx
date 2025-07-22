
'use client';

import React, { MutableRefObject } from 'react';

interface Point { x: number; y: number; }

interface PageDimensions {
  width: number;
  height: number;
}

interface DrawingLayersProps {
  isEditMode: boolean;
  lastMouseEvent: MutableRefObject<MouseEvent | null>;
  getSvgPoint: (e: MouseEvent) => Point | null;
  pageDimensions: PageDimensions;
  scale: number;
  drawingPolygon: Point[];
}

/**
 * DrawingLayers
 * Renders SVG elements related to the real-time drawing process,
 * such as crosshairs and the polygon being drawn.
 */
export function DrawingLayers({
  isEditMode,
  lastMouseEvent,
  getSvgPoint,
  pageDimensions,
  scale,
  drawingPolygon,
}: DrawingLayersProps) {
  if (!isEditMode) return null;

  return (
    <>
      {lastMouseEvent.current && (
        <g className="pointer-events-none">
          <line
            x1={0} y1={getSvgPoint(lastMouseEvent.current)?.y || 0}
            x2={pageDimensions.width} y2={getSvgPoint(lastMouseEvent.current)?.y || 0}
            stroke="hsl(var(--destructive))"
            strokeWidth={0.8 / scale}
            strokeDasharray={`${4 / scale} ${4 / scale}`}
          />
          <line
            x1={getSvgPoint(lastMouseEvent.current)?.x || 0} y1={0}
            x2={getSvgPoint(lastMouseEvent.current)?.x || 0} y2={pageDimensions.height}
            stroke="hsl(var(--destructive))"
            strokeWidth={0.8 / scale}
            strokeDasharray={`${4 / scale} ${4 / scale}`}
          />
        </g>
      )}
      {drawingPolygon.length > 0 && (
        <g className="pointer-events-none">
          <polygon
            points={drawingPolygon.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="hsl(var(--primary) / 0.3)"
            stroke="hsl(var(--primary))"
            strokeWidth={1.5 / scale}
          />
          {drawingPolygon.map((point, index) => (
            <circle key={`drawing-point-${index}`} cx={point.x} cy={point.y} r={4 / scale} fill="hsl(var(--primary))" />
          ))}
        </g>
      )}
    </>
  );
}
