
'use client';

import React from 'react';
import { Unit } from './FloorPlanViewer';
import { PolygonPopover } from './PolygonPopover';
import { STATUS_COLOR_MAP } from './utils';

interface UnitLayersProps {
  units: Unit[];
  isEditMode: boolean;
  isLocked: boolean;
  scale: number;
  onUnitClick: (unitId: string) => void;
  onUnitDelete: (unitId: string) => void;
  handlePointMouseDown: (event: React.MouseEvent<SVGCircleElement>, unitId: string, pointIndex: number) => void;
}

/**
 * UnitLayers
 * Renders all existing unit polygons and their draggable points onto the SVG canvas.
 * It uses the PolygonPopover for displaying unit information.
 */
export function UnitLayers({
  units,
  isEditMode,
  isLocked,
  scale,
  onUnitClick,
  onUnitDelete,
  handlePointMouseDown,
}: UnitLayersProps) {
  return (
    <>
      <g>
        {units.map((unit) =>
          unit.polygonPoints ? (
            <PolygonPopover
              key={unit.id}
              unit={unit}
              isEditMode={isEditMode}
              isLocked={isLocked}
              scale={scale}
              onUnitClick={onUnitClick}
              onUnitDelete={onUnitDelete}
            />
          ) : null
        )}
      </g>
      <g>
        {!isEditMode && !isLocked && units.map((unit) =>
          unit.polygonPoints?.map((point, index) => (
            <circle
              key={`${unit.id}-point-${index}`}
              cx={point.x}
              cy={point.y}
              r={5 / scale}
              fill={STATUS_COLOR_MAP[unit.status] ?? '#6b7280'}
              stroke="#fff"
              strokeWidth={1.5 / scale}
              onMouseDown={(e) => handlePointMouseDown(e, unit.id, index)}
              className="cursor-move transition-all hover:r-7 hover:stroke-2"
            />
          ))
        )}
      </g>
    </>
  );
}
