'use client';

import React, { useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Τύποι για τις props
interface ParkingTableHeaderProps {
  columns: Array<{ key: string; label: string; format?: (value: any) => string }>;
  columnWidths: number[];
  onColumnResize: (newWidths: number[]) => void;
  filters: { [key: string]: string };
  onFilterChange: (columnKey: string, value: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (columnKey: string) => void;
}

export function ParkingTableHeader({
  columns,
  columnWidths,
  onColumnResize,
  filters,
  onFilterChange,
  sortConfig,
  onSort,
}: ParkingTableHeaderProps) {

  const headerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const activeResizeIndex = useRef<number | null>(null);

  const handleMouseDown = useCallback((index: number) => (e: React.MouseEvent) => {
    activeResizeIndex.current = index;
    if (resizeHandleRef.current) {
        resizeHandleRef.current.style.display = 'block';
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (activeResizeIndex.current === null || !headerRef.current) return;

    const gridElement = headerRef.current;
    const gridRect = gridElement.getBoundingClientRect();
    const newWidths = [...columnWidths];
    const leftColumnIndex = activeResizeIndex.current;
    const rightColumnIndex = leftColumnIndex + 1;

    const leftColumn = gridElement.children[leftColumnIndex] as HTMLElement;
    
    if (leftColumn) {
        const leftEdge = leftColumn.getBoundingClientRect().left;
        const newLeftWidth = e.clientX - leftEdge;
        
        if (newLeftWidth > 50) { // Minimum width
          newWidths[leftColumnIndex] = newLeftWidth;
          onColumnResize(newWidths);
        }
    }
  }, [columnWidths, onColumnResize]);

  const handleMouseUp = useCallback(() => {
    activeResizeIndex.current = null;
    if (resizeHandleRef.current) {
        resizeHandleRef.current.style.display = 'none';
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  return (
    <div className="shrink-0 text-sm">
      {/* Headers */}
      <div 
        ref={headerRef}
        className="w-full h-10 border-b flex bg-muted/30 relative overflow-hidden"
        style={{ gridTemplateColumns: columnWidths.map(w => `${w}px`).join(' ') }}
      >
        {columns.map((col, index) => (
          <div
            key={col.key}
            className="flex items-center px-2 border-r last:border-r-0 font-medium text-muted-foreground whitespace-nowrap overflow-hidden"
            style={{ width: `${columnWidths[index]}px`}}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 -ml-1"
              onClick={() => onSort(col.key)}
            >
              <span>{col.label}</span>
              <ArrowUpDown className={cn(
                "ml-2 h-3 w-3 transition-transform",
                sortConfig?.key === col.key ? 'text-primary' : 'text-muted-foreground/50',
                sortConfig?.key === col.key && sortConfig.direction === 'desc' && 'rotate-180'
              )} />
            </Button>
            {index < columns.length - 1 && (
                <div 
                    className="absolute top-0 h-full w-1.5 cursor-col-resize"
                    style={{ left: `${columnWidths.slice(0, index + 1).reduce((a, b) => a + b, 0)}px` }}
                    onMouseDown={handleMouseDown(index)}
                />
            )}
          </div>
        ))}
      </div>
      
      {/* Filters */}
      <div className="flex w-full border-b bg-muted/20 items-stretch p-1 gap-1">
        {columns.map((col, index) => (
          <div key={col.key} style={{ width: `${columnWidths[index]}px`}}>
            <Input
              type="text"
              placeholder="..."
              className="h-7 text-xs rounded-sm border-0 focus-visible:ring-1 focus-visible:ring-primary"
              value={filters[col.key] || ''}
              onChange={(e) => onFilterChange(col.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
