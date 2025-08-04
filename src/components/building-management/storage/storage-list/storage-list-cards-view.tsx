'use client';

import React from 'react';
import { StorageCard } from '../storage-card/storage-card';
import { StorageUnit } from '@/lib/types/storage';

interface StorageListCardsViewProps {
  units: StorageUnit[];
  selectedUnits: string[];
  onSelectUnit: (unitId: string) => void;
  onEdit: (unit: StorageUnit) => void;
  onDelete: (unitId: string) => void;
}

export function StorageListCardsView({
  units,
  selectedUnits,
  onSelectUnit,
  onEdit,
  onDelete,
}: StorageListCardsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {units.map((unit) => (
        <StorageCard
          key={unit.id}
          unit={unit}
          isSelected={selectedUnits.includes(unit.id)}
          onSelect={() => onSelectUnit(unit.id)}
          onEdit={() => onEdit(unit)}
          onDelete={() => onDelete(unit.id)}
        />
      ))}
    </div>
  );
}
