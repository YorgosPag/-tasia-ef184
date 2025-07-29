'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
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