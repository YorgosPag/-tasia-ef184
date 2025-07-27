
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
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  page: number;
  totalCount: number | null;
  pageSize: number;
  activeFilters: Record<string, string>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  nextPage,
  prevPage,
  canGoNext,
  canGoPrev,
  page,
  totalCount,
  pageSize,
  activeFilters,
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
    const totalPages = totalCount !== null ? Math.ceil(totalCount / pageSize) : 0;
    const activeFilterEntries = Object.entries(activeFilters).filter(([, value]) => value);

    if (activeFilterEntries.length > 0) {
      const [firstFilterKey, firstFilterValue] = activeFilterEntries[0];
       const message = `Δεν βρέθηκαν αποτελέσματα στο φίλτρο "${firstFilterKey}" για την τιμή "${firstFilterValue}" σε αυτή τη σελίδα (${page}/${totalPages}).`;
       if (canGoNext) {
           return `${message} Παρακαλώ, πατήστε "Επόμενη" για να ελέγξετε τις υπόλοιπες σελίδες.`
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
            {table.getRowModel().rows?.length ? (
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
            Σελίδα {page} από {totalCount !== null ? Math.ceil(totalCount / pageSize) : '-'}
        </div>
        <div className="flex items-center space-x-2">
            <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={!canGoPrev}
            >
            Προηγούμενη
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!canGoNext}
            >
            Επόμενη
            </Button>
        </div>
      </div>
    </div>
  );
}
