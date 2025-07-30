

'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  page: number;
  totalCount: number | null;
  pageSize: number;
  activeFilters: Record<string, string>;
  initialDataLoaded: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  nextPage,
  prevPage,
  canGoNext,
  canGoPrev,
  page,
  totalCount,
  pageSize,
  activeFilters,
  initialDataLoaded
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
  });

  const NoResultsMessage = () => {
    if (!initialDataLoaded && isLoading) return "Φόρτωση...";

    const totalPages = totalCount !== null ? Math.ceil(totalCount / pageSize) : 0;
    const activeFilterEntries = Object.entries(activeFilters).filter(([, value]) => value);

    if (activeFilterEntries.length > 0 && data.length === 0) {
      const [firstFilterKey, firstFilterValue] = activeFilterEntries[0];
       let message = `Δεν βρέθηκαν αποτελέσματα για το φίλτρο "${firstFilterKey}" με τιμή "${firstFilterValue}" σε αυτή τη σελίδα (${page}/${totalPages}).`;
       if (canGoNext) {
           message += ' Παρακαλώ, πατήστε "Επόμενη" για να ελέγξετε τις υπόλοιπες σελίδες.'
       }
       return message;
    }

    if (totalCount === 0) {
        return "Δεν υπάρχουν εγγραφές σε αυτή τη λίστα."
    }

    return 'Δεν βρέθηκαν αποτελέσματα.';
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && !initialDataLoaded ? (
                 <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                </TableRow>
            ) : table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <NoResultsMessage />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
         <div className="text-sm text-muted-foreground">
             {totalCount !== null ? `Σελίδα ${page} από ${Math.ceil(totalCount / pageSize)}` : `Σελίδα ${page}`}
        </div>
        <div className="flex items-center space-x-2">
            <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={!canGoPrev || isLoading}
            >
            Προηγούμενη
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!canGoNext || isLoading}
            >
            Επόμενη
            </Button>
        </div>
      </div>
    </div>
  );
}
