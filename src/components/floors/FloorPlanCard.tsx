
'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { Unit } from '@/tasia/components/floor-plan/Unit';
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
  floorPlanUrl?: string;
  // The following props are kept for future use with polygons, but are not used in the current implementation.
  floorId: string;
  initialUnits: Unit[];
  onUnitClick: (unitId: string) => void;
}

/**
 * A card component that conditionally renders the FloorPlanViewer if a URL
 * is provided, or a placeholder message if not.
 */
export function FloorPlanCard({
  floorPlanUrl,
}: FloorPlanCardProps) {
  return (
    <Card className="p-0">
      <CardContent className="p-0">
         <FloorPlanViewer pdfUrl={floorPlanUrl} />
      </CardContent>
    </Card>
  );
}
