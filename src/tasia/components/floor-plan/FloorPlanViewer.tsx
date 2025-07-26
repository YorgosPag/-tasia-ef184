
'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useFloorPlanState } from '@/tasia/hooks/floor-plan/useFloorPlanState';
import { Toolbar } from './Toolbar';
import { InfoPanel } from './InfoPanel';
import { StatusFilter } from './StatusFilter';
import { PdfCanvas } from './PdfCanvas';
import type { Unit } from './Unit';

interface FloorPlanViewerProps {
  pdfUrl: string;
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  onUnitClick: (unitId: string) => void;
  onUnitDelete: (unitId: string) => void;
  onPolygonDrawn: (points: { x: number; y: number }[]) => void;
  onUnitPointsUpdate: (unitId: string, newPoints: { x: number; y: number }[]) => void;
}

export function FloorPlanViewer(props: FloorPlanViewerProps) {
  const state = useFloorPlanState({ onPolygonDrawn: props.onPolygonDrawn });

  if (!props.pdfUrl) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center">
          <p className="text-muted-foreground">Δεν έχει οριστεί κάτοψη για αυτόν τον όροφο.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Toolbar {...state.zoom} {...state} numPages={1} />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <PdfCanvas {...props} {...state} />
        </div>
        <div className="flex flex-col gap-2 lg:col-span-1">
          <InfoPanel {...state} />
          <StatusFilter 
            statusVisibility={state.statusVisibility} 
            onVisibilityChange={state.handleStatusVisibilityChange} 
          />
        </div>
      </div>
    </div>
  );
}
