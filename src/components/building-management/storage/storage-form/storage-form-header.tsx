'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Package, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StorageType } from '@/types/storage';

interface StorageFormHeaderProps {
  unitType?: StorageType;
  buildingName: string;
  projectName: string;
  isEditing: boolean;
  onCancel: () => void;
}

export function StorageFormHeader({
  unitType,
  buildingName,
  projectName,
  isEditing,
  onCancel,
}: StorageFormHeaderProps) {
  return (
    <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg shadow-sm",
              unitType === 'storage' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
            )}
          >
            {unitType === 'storage' ? <Package className="w-5 h-5" /> : <Car className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {isEditing ? 'Επεξεργασία' : 'Νέα'} {unitType === 'storage' ? 'Αποθήκη' : 'Θέση Στάθμευσης'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {buildingName} - {projectName}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
