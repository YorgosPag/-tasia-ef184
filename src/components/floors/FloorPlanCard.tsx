
'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Unit } from '@/tasia/components/floor-plan/Unit';
import { useFloorPlanDataManager } from '@/hooks/floor-plan/useFloorPlanDataManager';
import { UnitDialogForm } from '@/components/units/UnitDialogForm';
import dynamic from 'next/dynamic';
import { FloorPlanLoader } from './FloorPlanLoader';


const FloorPlanViewer = dynamic(
  () => import('./FloorPlanViewer').then((mod) => mod.FloorPlanViewer),
  {
    ssr: false,
    loading: () => <FloorPlanLoader />,
  }
);


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
         <FloorPlanViewer
          pdfUrl={floorPlanUrl}
          units={dataManager.units}
          setUnits={dataManager.setUnits}
          onPolygonDrawn={handlePolygonDrawn}
          onUnitClick={onUnitClick}
          onUnitPointsUpdate={dataManager.handleUnitPointsUpdate}
          highlightedUnitId={dataManager.highlightedUnitId}
        />
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
