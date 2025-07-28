
'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Unit } from '@/tasia/components/floor-plan/Unit';
import { useFloorPlanDataManager } from '@/tasia/hooks/floor-plan/useFloorPlanDataManager';
import { UnitDialogForm } from '@/tasia/components/units/UnitDialogForm';


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
        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Η προβολή κατόψεων είναι προσωρινά απενεργοποιημένη.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Η λειτουργικότητα θα αποκατασταθεί σύντομα.
            </p>
          </div>
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

    
