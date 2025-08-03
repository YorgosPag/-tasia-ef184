'use client';

import { useState } from 'react';
import { StorageUnit, StorageType, StorageStatus } from '@/lib/types/storage';

export function useStorageFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<StorageType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<StorageStatus | 'all'>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filterFloor,
    setFilterFloor,
  };
}

export function useStorageActions(
  setStorageUnits: React.Dispatch<React.SetStateAction<StorageUnit[]>>,
  setSelectedUnit: React.Dispatch<React.SetStateAction<StorageUnit | null>>,
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const handleAddNew = () => {
    setSelectedUnit(null);
    setShowForm(true);
  };

  const handleEdit = (unit: StorageUnit) => {
    setSelectedUnit(unit);
    setShowForm(true);
  };

  const handleSave = (unit: StorageUnit) => {
    setStorageUnits(units => {
      const existing = units.find(u => u.id === unit.id);
      if (existing) {
        return units.map(u => (u.id === unit.id ? unit : u));
      } else {
        return [...units, { ...unit, id: `new_${Date.now()}` }];
      }
    });
    setShowForm(false);
    setSelectedUnit(null);
  };

  const handleDelete = (unitId: string) => {
    setStorageUnits(units => units.filter(u => u.id !== unitId));
  };

  return { handleAddNew, handleEdit, handleSave, handleDelete };
}
