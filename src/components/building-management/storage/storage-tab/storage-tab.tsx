'use client';

import React, { useState } from 'react';
import { StorageForm } from '../storage-form';
import { StorageHeader } from './storage-tab-header';
import { StorageDashboard } from '../StorageDashboard';
import { StorageFilters } from '../StorageFilters';
import { StorageTabContent } from './storage-tab-content';
import { useStorageFilters, useStorageActions } from './storage-tab-hooks';
import { useFilteredStorage } from '@/hooks/useFilteredStorage';
import { StorageUnit } from '@/lib/types/storage';
import { mockStorageUnits } from './storage-tab-data';

interface StorageTabProps {
  building: {
    id: number;
    name: string;
    project: string;
    company: string;
  };
}

export function StorageTab({ building }: StorageTabProps) {
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>(mockStorageUnits);
  const [selectedUnit, setSelectedUnit] = useState<StorageUnit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filterFloor,
    setFilterFloor,
  } = useStorageFilters();
  
  const { filteredUnits, stats } = useFilteredStorage(storageUnits, {
    searchTerm,
    type: filterType,
    status: filterStatus,
    floor: filterFloor,
  });

  const {
    handleAddNew,
    handleEdit,
    handleSave,
    handleDelete,
  } = useStorageActions(setStorageUnits, setSelectedUnit, setShowForm);

  return (
    <div className="space-y-6">
      <StorageHeader 
        buildingName={building.name} 
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddNew={handleAddNew}
      />
      <StorageDashboard stats={stats} />
      <StorageFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterFloor={filterFloor}
        setFilterFloor={setFilterFloor}
      />
      
      <StorageTabContent 
        viewMode={viewMode}
        units={filteredUnits}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <StorageForm
          unit={selectedUnit}
          building={building}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedUnit(null);
          }}
        />
      )}
    </div>
  );
}
