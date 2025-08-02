
'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { columns } from './columns';
import { cn } from '@/lib/utils';

interface ParkingTableFiltersProps {
  layout: number[] | null;
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

export function ParkingTableFilters({ layout, filters, onFilterChange }: ParkingTableFiltersProps) {
  if (!layout) {
    return null;
  }

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="flex w-full shrink-0 border-b bg-muted/20 items-stretch">
      {columns.map((col, index) => (
        <div
          key={col.key}
          className={cn(
            "p-1 flex items-center min-w-0",
            index < columns.length - 1 && "border-r"
          )}
          style={{ flexBasis: `${layout[index]}%` }}
        >
          <Input
            placeholder={`Αναζήτηση...`}
            className="h-7 text-xs bg-background focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
            value={filters[col.key] || ''}
            onChange={(e) => handleFilterChange(col.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
