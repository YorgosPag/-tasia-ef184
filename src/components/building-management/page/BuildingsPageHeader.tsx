'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Plus, BarChart3, List, LayoutGrid } from 'lucide-react';

interface BuildingsPageHeaderProps {
  showDashboard: boolean;
  setShowDashboard: (value: boolean) => void;
  viewMode: 'list' | 'grid';
  setViewMode: (value: 'list' | 'grid') => void;
}

export function BuildingsPageHeader({
  showDashboard,
  setShowDashboard,
  viewMode,
  setViewMode,
}: BuildingsPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Διαχείριση Κτιρίων</h1>
          <p className="text-sm text-muted-foreground">
            Διαχείριση και παρακολούθηση κτιριακών έργων
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={showDashboard ? "default" : "outline"}
          size="sm"
          onClick={() => setShowDashboard(!showDashboard)}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant={viewMode === 'list' ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'grid' ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode('grid')}
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Νέο Κτίριο
        </Button>
      </div>
    </div>
  );
}
