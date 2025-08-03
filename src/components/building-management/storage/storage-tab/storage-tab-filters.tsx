'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BarChart3 } from 'lucide-react';
import { StorageType, StorageStatus } from '@/lib/types/storage';

interface StorageFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: StorageType | 'all';
  setFilterType: (value: StorageType | 'all') => void;
  filterStatus: StorageStatus | 'all';
  setFilterStatus: (value: StorageStatus | 'all') => void;
  filterFloor: string;
  setFilterFloor: (value: string) => void;
}

export function StorageFilters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterFloor,
  setFilterFloor
}: StorageFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Αναζήτηση κωδικού ή περιγραφής..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">Όλοι οι τύποι</option>
            <option value="storage">Αποθήκες</option>
            <option value="parking">Θέσεις Στάθμευσης</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">Όλες οι καταστάσεις</option>
            <option value="available">Διαθέσιμα</option>
            <option value="sold">Πωλήθηκαν</option>
            <option value="reserved">Κρατημένα</option>
            <option value="maintenance">Συντήρηση</option>
          </select>

          <select
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">Όλοι οι όροφοι</option>
            <option value="Υπόγειο">Υπόγειο</option>
            <option value="Ισόγειο">Ισόγειο</option>
            <option value="1ος">1ος Όροφος</option>
          </select>

          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Εξαγωγή Αναφοράς
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
