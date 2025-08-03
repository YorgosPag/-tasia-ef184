'use client';

import { Archive, Plus, List, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StorageHeaderProps {
  buildingName: string;
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;
  onAddNew: () => void;
}

export function StorageHeader({
  buildingName,
  viewMode,
  setViewMode,
  onAddNew,
}: StorageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Archive className="w-5 h-5" />
          Αποθήκες & Θέσεις Στάθμευσης
        </h3>
        <p className="text-sm text-muted-foreground">
          Διαχείριση παρακολουθημάτων κτιρίου {buildingName}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <List className="w-4 h-4 mr-2" /> Λίστα
        </Button>
        <Button
          variant={viewMode === 'map' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('map')}
        >
          <MapPin className="w-4 h-4 mr-2" /> Χάρτης
        </Button>
        <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Νέα Μονάδα
        </Button>
      </div>
    </div>
  );
}
