
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Unit } from './Unit';


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
  
  return (
    <Card>
        <CardContent className="flex h-96 items-center justify-center">
            <p className="text-muted-foreground">Floor plan viewer functionality is currently under development.</p>
        </CardContent>
    </Card>
  );
}
