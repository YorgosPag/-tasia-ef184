
'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { FloorPlanViewer } from './FloorPlanViewer';

interface FloorPlanCardProps {
  floorPlanUrl?: string;
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
