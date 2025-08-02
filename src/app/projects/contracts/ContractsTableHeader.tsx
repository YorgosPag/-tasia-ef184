'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface ContractsTableHeaderProps {
    columns: Array<{ key: string; label: string; }>;
    columnWidths: number[];
    onColumnResize: (widths: number[]) => void;
    filters: { [key: string]: string };
    onFilterChange: (columnKey: string, value: string) => void;
    sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
    onSort: (columnKey: string) => void;
}

export function ContractsTableHeader({ 
  columns,
  columnWidths, 
  onColumnResize, 
  filters, 
  onFilterChange,
  sortConfig,
  onSort
}: ContractsTableHeaderProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizingIndex, setResizingIndex] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidths, setStartWidths] = useState<number[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setIsResizing(true);
    setResizingIndex(index);
    setStartX(e.clientX);
    setStartWidths([...columnWidths]);
  };

  const handleFilterInputChange = (columnKey: string, value: string) => {
    onFilterChange(columnKey, value);
  };

  const clearFilter = (columnKey: string) => {
    onFilterChange(columnKey, '');
  };

  const renderSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-primary" />
      : <ChevronDown className="h-4 w-4 text-primary" />;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || resizingIndex === null) return;

      const diff = e.clientX - startX;
      const newWidths = [...startWidths];
      
      newWidths[resizingIndex] = Math.max(100, startWidths[resizingIndex] + diff);
      
      if (resizingIndex < newWidths.length - 1) {
        newWidths[resizingIndex + 1] = Math.max(100, startWidths[resizingIndex + 1] - diff);
      }
      
      onColumnResize(newWidths);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizingIndex(null);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizingIndex, startX, startWidths, onColumnResize]);

  return (
    <div className="w-full shrink-0 flex flex-col border-b bg-card">
      <div className="w-full h-12 flex bg-muted/20 border-b">
        {columns.map((column, index) => (
          <div 
            key={`filter-${column.key}`} 
            className="relative flex-shrink-0 border-r last:border-r-0 h-full"
            style={{ width: `${columnWidths[index]}px` }}
          >
            <div className="h-full flex items-center justify-start p-2 overflow-hidden relative">
              <input
                type="text"
                placeholder="Αναζήτηση..."
                value={filters[column.key] || ''}
                onChange={(e) => handleFilterInputChange(column.key, e.target.value)}
                className="w-full text-sm bg-transparent border border-muted-foreground/20 rounded px-2 py-1 outline-none placeholder-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/20 pr-7"
              />
              {filters[column.key] && (
                <button
                  onClick={() => clearFilter(column.key)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                  title="Καθαρισμός φίλτρου"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div 
        ref={headerRef}
        className="w-full h-12 flex bg-muted/40 relative overflow-hidden"
      >
        {columns.map((header, index) => (
          <div 
            key={header.key} 
            className="relative flex-shrink-0 border-r last:border-r-0 h-full"
            style={{ width: `${columnWidths[index]}px` }}
          >
            <div className="h-full flex items-center justify-between p-3 font-semibold text-foreground overflow-hidden group cursor-pointer"
                 onClick={() => onSort(header.key)}>
              <span className="truncate text-sm font-medium">{header.label}</span>
              <div className="ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
                {renderSortIcon(header.key)}
              </div>
            </div>
            
            {index < columns.length - 1 && (
              <div
                className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-primary/30 active:bg-primary/50 z-10"
                onMouseDown={(e) => handleMouseDown(e, index)}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
