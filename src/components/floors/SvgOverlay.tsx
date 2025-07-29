
'use client';

import React from 'react';
import { Unit } from '@/tasia/components/floor-plan/Unit';
import { getTextColorForBackground } from '@/components/units/utils';

interface SvgOverlayProps {
  svgRef: React.RefObject<SVGSVGElement>;
  pageDimensions: { width: number; height: number };
  units: Unit[];
  statusVisibility: Record<Unit['status'], boolean>;
  statusColors: Record<Unit['status'], string>;
  isEditMode: boolean;
  isLocked: boolean;
  drawingPolygon: { x: number; y: number }[];
  highlightedUnitId: string | null;
  onUnitClick: (unitId: string) => void;
  onPointMouseDown: (
    e: React.MouseEvent<SVGCircleElement>,
    unitId: string,
    pointIndex: number
  ) => void;
  onSvgClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  onMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
}

export function SvgOverlay({
  svgRef,
  pageDimensions,
  units,
  statusVisibility,
  statusColors,
  isEditMode,
  isLocked,
  drawingPolygon,
  highlightedUnitId,
  onUnitClick,
  onPointMouseDown,
  onSvgClick,
  onMouseMove,
}: SvgOverlayProps) {
  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 w-full h-full z-10"
      style={{
        width: pageDimensions.width,
        height: pageDimensions.height,
        cursor: isEditMode && !isLocked ? 'crosshair' : 'default',
      }}
      onClick={onSvgClick}
      onMouseMove={onMouseMove}
    >
      {units.map((unit) => {
        if (!statusVisibility[unit.status] || !unit.polygonPoints || unit.polygonPoints.length === 0) {
          return null;
        }

        const pointsString = unit.polygonPoints.map((p) => `${p.x},${p.y}`).join(' ');
        const isHighlighted = highlightedUnitId === unit.id;

        return (
          <g key={unit.id} onClick={() => !isEditMode && onUnitClick(unit.id)}>
            <polygon
              points={pointsString}
              style={{
                fill: statusColors[unit.status],
                stroke: isHighlighted ? 'cyan' : 'black',
                strokeWidth: isHighlighted ? 3 : 1,
                fillOpacity: 0.6,
                cursor: !isEditMode ? 'pointer' : 'default',
                transition: 'stroke 0.2s, stroke-width 0.2s',
              }}
            />
            {unit.polygonPoints.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={isLocked ? 0 : 5}
                fill="white"
                stroke="black"
                strokeWidth="1"
                onMouseDown={(e) => onPointMouseDown(e, unit.id, index)}
                style={{ cursor: isLocked ? 'default' : 'move' }}
              />
            ))}
             <text
                x={unit.polygonPoints.reduce((sum, p) => sum + p.x, 0) / unit.polygonPoints.length}
                y={unit.polygonPoints.reduce((sum, p) => sum + p.y, 0) / unit.polygonPoints.length}
                dy=".3em"
                textAnchor="middle"
                className={`text-xs font-bold pointer-events-none ${getTextColorForBackground(statusColors[unit.status])}`}
                style={{ fill: getTextColorForBackground(statusColors[unit.status]) === 'text-white' ? 'white' : 'black' }}
            >
                {unit.identifier}
            </text>
          </g>
        );
      })}
      {isEditMode && drawingPolygon.length > 0 && (
        <polyline
          points={drawingPolygon.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="blue"
          strokeWidth="2"
          strokeDasharray="4"
        />
      )}
    </svg>
  );
}
