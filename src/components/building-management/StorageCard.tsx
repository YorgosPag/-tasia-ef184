'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { StorageUnit } from '@/lib/types/storage';
import { StorageCardHeader } from './storage/storage-card/storage-card-header';
import { StorageCardContent } from './storage/storage-card/storage-card-content';
import { StorageCardFeatures } from './storage/storage-card/storage-card-features';
import { StorageCardActions } from './storage/storage-card/storage-card-actions';

interface StorageCardProps {
  unit: StorageUnit;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function StorageCard({ 
  unit, 
  isSelected,
  onSelect,
  onEdit, 
  onDelete,
}: StorageCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group",
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md",
        "transform hover:scale-[1.02]"
      )}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StorageCardHeader 
        unit={unit}
        isHovered={isHovered}
        isFavorite={isFavorite}
        isSelected={isSelected}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={() => setIsFavorite(!isFavorite)}
      />

      <CardContent className="p-4 space-y-3">
        <StorageCardContent unit={unit} />
        <StorageCardFeatures unit={unit} />
        <StorageCardActions onEdit={onEdit} unitId={unit.id} />
      </CardContent>

      {/* Hover overlay effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-blue-500/3 to-transparent pointer-events-none transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
    </Card>
  );
}
