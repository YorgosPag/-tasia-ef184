'use client';

import React from 'react';
import type { ParkingSpot } from './types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Eye, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParkingTableRowProps {
  spot: ParkingSpot;
  columns: Array<{ key: string; label: string; format?: (value: any) => string }>;
  columnWidths: number[];
  isSelected: boolean;
  onSelect: () => void;
}

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'Διαθέσιμο': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
        case 'Πουλημένο': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
        case 'Δεσμευμένο': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
        case 'Οικοπεδούχοι': return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
}

export function ParkingTableRow({
  spot,
  columns,
  columnWidths,
  isSelected,
  onSelect
}: ParkingTableRowProps) {
  return (
    <div
      className={cn(
        "flex w-full border-b text-xs transition-colors cursor-pointer",
        isSelected
          ? "bg-primary/10 hover:bg-primary/20"
          : "hover:bg-muted/50"
      )}
      onClick={onSelect}
    >
      {columns.map((col, index) => {
        const value = spot[col.key as keyof ParkingSpot];
        const formattedValue = col.format ? col.format(value) : value;

        return (
          <div
            key={col.key}
            className="flex items-center px-2 py-1.5 border-r last:border-r-0 whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ width: `${columnWidths[index]}px` }}
          >
            {col.key === 'status' ? (
                <Badge variant="outline" className={cn("text-xs", getStatusBadgeClass(String(value)))}>{value}</Badge>
            ) : col.key === 'holder' ? (
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                    <Eye className="w-3 h-3 mr-1"/> Κάτοψη
                </Button>
            ) : (
              <span className="truncate">{formattedValue}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
