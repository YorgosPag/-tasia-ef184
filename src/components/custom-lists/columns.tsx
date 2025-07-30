
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ComplexEntity } from '@/shared/hooks/useComplexEntities';
import { Button } from '@/shared/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

// This file is no longer the primary source for columns.
// The columns are now generated dynamically in ComplexEntitiesTab.tsx.
// This remains as a fallback or example structure.

export const columns: ColumnDef<ComplexEntity>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Όνομα
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'address',
    header: 'Διεύθυνση',
  },
  {
    accessorKey: 'region',
    header: 'Περιοχή',
  },
  {
    accessorKey: 'phone',
    header: 'Τηλέφωνο',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const entity = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ενέργειες</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(entity.id)}
            >
              Αντιγραφή ID
            </DropdownMenuItem>
            <DropdownMenuItem>Επεξεργασία</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Διαγραφή</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

    
