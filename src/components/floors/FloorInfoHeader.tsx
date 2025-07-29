
'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Floor {
  level: string;
  description?: string;
}

interface FloorInfoHeaderProps {
  floor: Floor;
  onBack: () => void;
}

/**
 * Displays the header for the floor details page, including navigation,
 * and floor information.
 */
export function FloorInfoHeader({
  floor,
  onBack,
}: FloorInfoHeaderProps) {
    
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="w-fit" type="button" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Επιστροφή
        </Button>
        <div>
          <h1 className="text-xl font-bold">Όροφος: {floor.level}</h1>
          <p className="text-sm text-muted-foreground">
            Περιγραφή: {floor.description || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
