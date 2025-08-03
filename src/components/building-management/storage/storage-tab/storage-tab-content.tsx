'use client';

import React from 'react';
import { StorageList } from '../storage-list';
import { StorageMapPlaceholder } from './storage-tab-map-view';
import { StorageUnit } from '@/lib/types/storage';

interface StorageTabContentProps {
  viewMode: 'list' | 'map';
  units: StorageUnit[];
  onEdit: (unit: StorageUnit) => void;
  onDelete: (unitId: string) => void;
}

export function StorageTabContent({
  viewMode,
  units,
  onEdit,
  onDelete,
}: StorageTabContentProps) {
  if (viewMode === 'list') {
    return <StorageList units={units} onEdit={onEdit} onDelete={onDelete} />;
  }
  return <StorageMapPlaceholder />;
}
