
'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { FloorPlanLoader } from './FloorPlanLoader';
import type { Unit } from '@/tasia/components/floor-plan/Unit';
import { useFloorPlanDataManager } from '@/tasia/hooks/floor-plan/useFloorPlanDataManager';
import { Loader2 } from 'lucide-react';
import { UnitDialogForm } from '@/components/units/UnitDialogForm';


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
  const dataManager = useFloorPlanDataManager({ floorId, initialUnits });

  const handlePolygonDrawn = (points: { x: number, y: number }[]) => {
    dataManager.setDrawingPolygon(points);
    dataManager.setIsDialogOpen(true);
  }

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        {floorPlanUrl ? (
          <FloorPlanLoader
            pdfUrl={floorPlanUrl}
            units={dataManager.units}
            setUnits={dataManager.setUnits}
            onPolygonDrawn={handlePolygonDrawn}
            onUnitPointsUpdate={dataManager.handleUnitPointsUpdate}
            onUnitClick={onUnitClick}
            onUnitDelete={dataManager.handleDeleteUnit}
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
      <UnitDialogForm
        open={dataManager.isDialogOpen}
        onOpenChange={dataManager.setIsDialogOpen}
        onSubmit={dataManager.form.handleSubmit(dataManager.onSubmitUnit)}
        form={dataManager.form}
        isSubmitting={dataManager.isSubmitting}
        editingUnit={dataManager.editingUnit}
        drawingPolygon={dataManager.drawingPolygon}
        availableUnits={dataManager.unitsWithoutPolygon}
      />
    </Card>
  );
}

    
