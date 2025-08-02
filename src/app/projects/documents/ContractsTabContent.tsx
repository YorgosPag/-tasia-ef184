'use client';

import React, { useState, useMemo } from 'react';
import { Contract } from '../contracts/types';
import { ContractsToolbar } from '../contracts/ContractsToolbar';
import { ContractsTableHeader } from '../contracts/ContractsTableHeader';
import { ContractsTableRow } from '../contracts/ContractsTableRow';
import { ContractsTableMobile } from '../contracts/ContractsTableMobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { columns } from '../contracts/columns';
import { contracts as mockContracts } from './data';

type FilterState = { [key: string]: string };
type SortConfig = { key: string; direction: 'asc' | 'desc'; } | null;

export function ContractsTabContent() {
  const [contracts] = useState<Contract[]>(mockContracts);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(contracts.length > 0 ? contracts[0] : null);
  const [filters, setFilters] = useState<FilterState>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(col => col.key));
  
  const getDefaultWidths = () => columns.map(() => 150);
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

  const processedContracts = useMemo(() => {
    if (!contracts) return [];
    
    let filtered = contracts.filter(contract => {
      return filteredColumns.every(column => {
        const filterValue = filters[column.key];
        if (!filterValue) return true;
        
        const contractValue = contract[column.key as keyof Contract];
        const displayValue = String(contractValue || '').toLowerCase();
        
        return displayValue.includes(filterValue.toLowerCase());
      });
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Contract];
        const bValue = b[sortConfig.key as keyof Contract];
        
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
  }, [contracts, filters, filteredColumns, sortConfig]);

  useMemo(() => {
    if (selectedContract && !processedContracts.find(c => c.id === selectedContract.id)) {
      setSelectedContract(processedContracts.length > 0 ? processedContracts[0] : null);
    }
  }, [processedContracts, selectedContract]);

  if (!contracts || contracts.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <p className="text-lg mb-2">Δεν υπάρχουν δεδομένα</p>
            <p className="text-sm">Δεν βρέθηκαν συμβόλαια για αυτό το έργο.</p>
          </div>
        </div>
      );
  }

  return (
    <div className="bg-card border rounded-lg shadow-sm flex flex-col h-full">
      <ContractsToolbar 
        selectedContract={selectedContract} 
        hasActiveFilters={Object.values(filters).some(value => value.length > 0)}
        onClearFilters={clearFilters}
        totalCount={contracts.length}
        filteredCount={processedContracts.length}
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumnVisibility={toggleColumnVisibility}
      />
      
      <div className="hidden md:flex flex-col flex-grow min-h-0">
         <ContractsTableHeader 
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
                {processedContracts.map((contract) => (
                <ContractsTableRow
                    key={contract.id}
                    contract={contract}
                    columns={filteredColumns}
                    columnWidths={columnWidths}
                    isSelected={contract.id === selectedContract?.id}
                    onSelect={() => setSelectedContract(contract)}
                />
                ))}
                {processedContracts.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                      <p>Δεν βρέθηκαν αποτελέσματα</p>
                  </div>
                )}
            </div>
        </ScrollArea>
      </div>
      
      <div className="md:hidden flex-grow">
          <ContractsTableMobile 
            contracts={processedContracts}
            selectedContract={selectedContract}
            onSelectContract={setSelectedContract}
          />
      </div>
    </div>
  );
}
