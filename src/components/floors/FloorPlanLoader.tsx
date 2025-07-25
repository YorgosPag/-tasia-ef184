
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

export const FloorPlanLoader = dynamic(
  () => import('@/components/floor-plan/FloorPlanViewer').then(mod => mod.FloorPlanViewer),
  {
    loading: () => (
      <div className="flex h-40 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
    ssr: false, // This component is client-side only
  }
);
