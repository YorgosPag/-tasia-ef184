
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FloorPlanViewer } from '@/components/floor-plan/FloorPlanViewer';
import type { Unit } from '@/components/floor-plan/FloorPlanViewer';


interface FloorPlanCardProps {
  floorId: string;
  floorPlanUrl?: string;
  initialUnits: Unit[];
  onUnitClick: (unitId: string) => void;
}

/**
 * A card component that conditionally renders the FloorPlanViewer if a URL
 * is provided, or a placeholder message if not.
 * It now manages its own data fetching via the FloorPlanViewer.
 */
export function FloorPlanCard({
  floorId,
  floorPlanUrl,
  initialUnits,
  onUnitClick,
}: FloorPlanCardProps) {
  return (
    <Card className="p-0">
      <CardContent className="p-0">
        {floorPlanUrl ? (
          <FloorPlanViewer
            floorId={floorId}
            pdfUrl={floorPlanUrl}
            initialUnits={initialUnits}
            onUnitSelect={onUnitClick}
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
