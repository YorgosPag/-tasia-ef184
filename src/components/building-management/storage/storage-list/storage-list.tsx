'use client';

import React, { useState } from 'react';
import { StorageUnit } from '@/lib/types/storage';
import { StorageListHeader } from './storage-list-header';
import { StorageListCardsView } from './storage-list-cards-view';
import { StorageListTableView } from './storage-list-table-view';
import { StorageListSummary } from './storage-list-summary';
import { StorageListEmptyState } from './storage-list-empty-state';

interface StorageListProps {
  units: StorageUnit[];
  onEdit: (unit: StorageUnit) => void;
  onDelete: (unitId: string) => void;
}

export function StorageList({ units, onEdit, onDelete }: StorageListProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUnits.length === units.length) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(units.map(u => u.id));
    }
  };

  const handleBulkDelete = () => {
    selectedUnits.forEach(unitId => onDelete(unitId));
    setSelectedUnits([]);
  };

  if (units.length === 0) {
    return <StorageListEmptyState />;
  }

  return (
    <div className="space-y-4">
      <StorageListHeader
        unitsCount={units.length}
        selectedCount={selectedUnits.length}
        onBulkDelete={handleBulkDelete}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {viewMode === 'cards' ? (
        <StorageListCardsView
          units={units}
          selectedUnits={selectedUnits}
          onSelectUnit={handleSelectUnit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <StorageListTableView
          units={units}
          selectedUnits={selectedUnits}
          onSelectUnit={handleSelectUnit}
          onSelectAll={handleSelectAll}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      <StorageListSummary units={units} />
    </div>
  );
}
