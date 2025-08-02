'use client';

import React, { useState, useMemo } from 'react';
import { MiscellaneousDocument } from './types';
import { MiscellaneousDocumentsToolbar } from './MiscellaneousDocumentsToolbar';
import { MiscellaneousDocumentsTableHeader } from './MiscellaneousDocumentsTableHeader';
import { MiscellaneousDocumentsTableRow } from './MiscellaneousDocumentsTableRow';
import { MiscellaneousDocumentsTableMobile } from './MiscellaneousDocumentsTableMobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { columns } from './columns';
import { miscellaneousDocuments as mockDocuments } from './data';

type FilterState = { [key: string]: string };
type SortConfig = { key: string; direction: 'asc' | 'desc'; } | null;

export function MiscellaneousTabContent() {
  const [documents] = useState<MiscellaneousDocument[]>(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState<MiscellaneousDocument | null>(documents.length > 0 ? documents[0] : null);
  const [filters, setFilters] = useState<FilterState>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(col => col.key));

  const getDefaultWidths = () => columns.map(col => col.defaultWidth || 150);
  const [columnWidths, setColumnWidths] = useState<number[]>(getDefaultWidths());

  const handleColumnResize = (newWidths: number[]) => {
    setColumnWidths(newWidths);
  };

  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => ({ ...prev, [columnKey]: value }));
  };

  const clearFilters = () => setFilters({});

  const handleSort = (columnKey: string) => {
    setSortConfig(prev => {
      if (prev?.key === columnKey) {
        return { key: columnKey, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key: columnKey, direction: 'asc' };
      }
    });
  };

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.length > 1 ? prev.filter(key => key !== columnKey) : prev;
      } else {
        return [...prev, columnKey];
      }
    });
  };

  const filteredColumns = useMemo(() => {
    return columns.filter(col => visibleColumns.includes(col.key));
  }, [visibleColumns]);

  const processedDocuments = useMemo(() => {
    if (!documents) return [];
    
    let filtered = documents.filter(doc => {
      return filteredColumns.every(column => {
        const filterValue = filters[column.key];
        if (!filterValue) return true;
        
        const docValue = doc[column.key as keyof MiscellaneousDocument];
        const displayValue = String(docValue || '').toLowerCase();
        
        return displayValue.includes(filterValue.toLowerCase());
      });
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof MiscellaneousDocument];
        const bValue = b[sortConfig.key as keyof MiscellaneousDocument];
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [documents, filters, filteredColumns, sortConfig]);

  useMemo(() => {
    if (selectedDocument && !processedDocuments.find(d => d.id === selectedDocument.id)) {
      setSelectedDocument(processedDocuments.length > 0 ? processedDocuments[0] : null);
    }
  }, [processedDocuments, selectedDocument]);

  if (!documents || documents.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Δεν υπάρχουν δεδομένα</p>
        </div>
      );
  }

  return (
    <div className="bg-card border rounded-lg shadow-sm flex flex-col h-full">
      <MiscellaneousDocumentsToolbar 
        selectedDocument={selectedDocument} 
        hasActiveFilters={Object.values(filters).some(value => value.length > 0)}
        onClearFilters={clearFilters}
        totalCount={documents.length}
        filteredCount={processedDocuments.length}
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumnVisibility={toggleColumnVisibility}
      />
      
      <div className="hidden md:flex flex-col flex-grow min-h-0">
         <MiscellaneousDocumentsTableHeader 
           columns={filteredColumns}
           columnWidths={columnWidths} 
           onColumnResize={handleColumnResize}
           filters={filters}
           onFilterChange={handleFilterChange}
           sortConfig={sortConfig}
           onSort={handleSort}
         />
         <ScrollArea className="flex-grow">
            <div className="flex flex-col">
                {processedDocuments.map((doc) => (
                <MiscellaneousDocumentsTableRow
                    key={doc.id}
                    document={doc}
                    columns={filteredColumns}
                    columnWidths={columnWidths}
                    isSelected={doc.id === selectedDocument?.id}
                    onSelect={() => setSelectedDocument(doc)}
                />
                ))}
            </div>
        </ScrollArea>
      </div>
      
      <div className="md:hidden flex-grow">
          <MiscellaneousDocumentsTableMobile 
            documents={processedDocuments}
            selectedDocument={selectedDocument}
            onSelectDocument={setSelectedDocument}
          />
      </div>
    </div>
  );
}
