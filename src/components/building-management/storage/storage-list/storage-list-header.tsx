'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, List, LayoutGrid } from 'lucide-react';

interface StorageListHeaderProps {
  unitsCount: number;
  selectedCount: number;
  onBulkDelete: () => void;
  viewMode: 'cards' | 'table';
  setViewMode: (mode: 'cards' | 'table') => void;
}

export function StorageListHeader({
  unitsCount,
  selectedCount,
  onBulkDelete,
  viewMode,
  setViewMode,
}: StorageListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {unitsCount} αποτελέσματα
        </span>
        {selectedCount > 0 && (
          <>
            <span className="text-sm text-blue-600">
              • {selectedCount} επιλεγμένα
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Διαγραφή επιλεγμένων
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'cards' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('cards')}
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
          Κάρτες
        </Button>
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('table')}
        >
          <List className="w-4 h-4 mr-2" />
          Πίνακας
        </Button>
      </div>
    </div>
  );
}
