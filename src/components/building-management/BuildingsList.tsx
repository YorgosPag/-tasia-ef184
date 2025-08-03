'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BuildingToolbar } from './BuildingToolbar';
import type { Building } from '@/types/building';
import { BuildingListHeader } from './list/BuildingListHeader';
import { BuildingListItem } from './list/BuildingListItem';

interface BuildingsListProps {
  buildings: Building[];
  selectedBuilding: Building;
  onSelectBuilding?: (building: Building) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingsList({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  getStatusColor,
  getStatusLabel
}: BuildingsListProps) {
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'value' | 'area'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleFavorite = (buildingId: number) => {
    setFavorites(prev =>
      prev.includes(buildingId)
        ? prev.filter(id => id !== buildingId)
        : [...prev, buildingId]
    );
  };
  
  const sortedBuildings = [...buildings].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'progress':
        aValue = a.progress;
        bValue = b.progress;
        break;
      case 'value':
        aValue = a.totalValue;
        bValue = b.totalValue;
        break;
      case 'area':
        aValue = a.totalArea;
        bValue = b.totalArea;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });


  return (
    <div className="w-[420px] bg-card border-r flex flex-col shrink-0 shadow-sm">
      <BuildingListHeader 
        buildings={buildings}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <BuildingToolbar />

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sortedBuildings.map((building) => (
            <BuildingListItem
              key={building.id}
              building={building}
              selectedBuildingId={selectedBuilding?.id}
              onSelectBuilding={onSelectBuilding}
              toggleFavorite={toggleFavorite}
              favorites={favorites}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
