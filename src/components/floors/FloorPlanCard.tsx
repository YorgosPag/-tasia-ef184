
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FloorPlanViewer } from '@/components/floor-plan/FloorPlanViewer';
import type { Unit } from '@/components/floor-plan/FloorPlanViewer';


interface FloorPlanCardProps {
  floorPlanUrl?: string;
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  onUnitClick: (unitId: string) => void;
  onUnitDelete: (unitId: string) => void;
  onPolygonDrawn: (points: { x: number; y: number }[]) => void;
  onUnitPointsUpdate: (unitId: string, newPoints: { x: number; y: number }[]) => void;
}

/**
 * A card component that conditionally renders the FloorPlanViewer if a URL
 * is provided, or a placeholder message if not.
 */
export function FloorPlanCard({
  floorPlanUrl,
  units,
  setUnits,
  onUnitClick,
  onUnitDelete,
  onPolygonDrawn,
  onUnitPointsUpdate,
}: FloorPlanCardProps) {
  return (
    <Card className="p-0">
      <CardContent className="p-0">
        {floorPlanUrl ? (
          <FloorPlanViewer
            pdfUrl={floorPlanUrl}
            units={units}
            setUnits={setUnits}
            onUnitClick={onUnitClick}
            onUnitDelete={onUnitDelete}
            onPolygonDrawn={onPolygonDrawn}
            onUnitPointsUpdate={onUnitPointsUpdate}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Δεν έχει ανέβει κάτοψη για αυτόν τον όροφο.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Χρησιμοποιήστε το πεδίο παραπάνω για να ανεβάσετε ένα αρχείο PDF.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
