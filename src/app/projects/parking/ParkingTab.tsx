'use client';

import React, { useState, useMemo } from 'react';
import { ParkingSpot } from './types';
import { ParkingToolbar } from './ParkingToolbar';
import { ParkingTableHeader } from './ParkingTableHeader';
import { ParkingTableRow } from './ParkingTableRow';
import { ParkingTableMobile } from './ParkingTableMobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { columns } from './columns';

// Τύπος για τα φίλτρα
type FilterState = { [key: string]: string };

// Τύπος για το sorting
type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

export function ParkingTab({ parkingSpots }: { parkingSpots: ParkingSpot[] }) {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(parkingSpots.length > 0 ? parkingSpots[0] : null);
  const [filters, setFilters] = useState<FilterState>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(col => col.key));
  
  // Βελτιωμένα default widths με καλύτερο spacing
  const getDefaultWidths = () => {
    const defaultWidths = {
      'code': 120,        // Κωδικός
      'type': 140,        // Τύπος  
      'property': 160,    // Ακίνητο
      'level': 120,       // Επίπεδο
      'tm': 100,          // Τ.Μ.
      'price': 140,       // Τιμή
      'value': 140,       // Αντ. Αξία
      'valueWithVat': 200, // Αντ. Αξία Με Συνιδιοκτησία
      'status': 120,      // Κατάσταση
      'owner': 160,       // Ιδιοκτήτης
      'holder': 140,      // Κάτοψη
      'registeredBy': 160 // Καταχωρήθηκε Από
    };
    
    return columns.map(col => defaultWidths[col.key] || col.defaultWidth || 140);
  };

  const [columnWidths, setColumnWidths] = useState<number[]>(getDefaultWidths());

  const handleColumnResize = (newWidths: number[]) => {
    setColumnWidths(newWidths);
  };

  // Συνάρτηση για ενημέρωση φίλτρων
  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  // Συνάρτηση για καθαρισμό φίλτρων
  const clearFilters = () => {
    setFilters({});
  };

  // Συνάρτηση για sorting
  const handleSort = (columnKey: string) => {
    setSortConfig(prev => {
      if (prev?.key === columnKey) {
        // Αν κάνουμε click στην ίδια στήλη, αλλάζουμε κατεύθυνση
        return { key: columnKey, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        // Νέα στήλη, ξεκινάμε με ascending
        return { key: columnKey, direction: 'asc' };
      }
    });
  };

  // Συνάρτηση για toggle visibility στηλών
  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        // Αν υπάρχει, την αφαιρούμε (αλλά κρατάμε τουλάχιστον μία στήλη)
        return prev.length > 1 ? prev.filter(key => key !== columnKey) : prev;
      } else {
        // Αν δεν υπάρχει, την προσθέτουμε
        return [...prev, columnKey];
      }
    });
  };

  // Φιλτραρισμένες στήλες
  const filteredColumns = useMemo(() => {
    return columns.filter(col => visibleColumns.includes(col.key));
  }, [visibleColumns]);

  // Φιλτραρισμένα και ταξινομημένα spots
  const processedParkingSpots = useMemo(() => {
    if (!parkingSpots) return [];
    
    // Πρώτα φιλτράρουμε
    let filtered = parkingSpots.filter(spot => {
      return filteredColumns.every(column => {
        const filterValue = filters[column.key];
        if (!filterValue) return true; // Αν δεν υπάρχει φίλτρο, περνάει
        
        const spotValue = spot[column.key as keyof ParkingSpot];
        let displayValue = '';
        
        // Μετατροπή σε string για σύγκριση
        if (column.format && spotValue !== null && spotValue !== undefined) {
          displayValue = String(column.format(spotValue));
        } else {
          displayValue = String(spotValue || '');
        }
        
        // Case-insensitive αναζήτηση
        return displayValue.toLowerCase().includes(filterValue.toLowerCase());
      });
    });

    // Μετά ταξινομούμε
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof ParkingSpot];
        const bValue = b[sortConfig.key as keyof ParkingSpot];
        
        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
        
        // Numeric comparison
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // String comparison
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [parkingSpots, filters, filteredColumns, sortConfig]);

  // Υπολογισμός totals βάσει φιλτραρισμένων αποτελεσμάτων
  const totals = useMemo(() => {
    if (!processedParkingSpots) return { tm: 0, price: 0, value: 0, valueWithVat: 0 };
    return processedParkingSpots.reduce(
      (acc, spot) => {
        acc.tm += spot.tm || 0;
        acc.price += spot.price || 0;
        acc.value += spot.value || 0;
        acc.valueWithVat += spot.valueWithVat || 0;
        return acc;
      },
      { tm: 0, price: 0, value: 0, valueWithVat: 0 }
    );
  }, [processedParkingSpots]);

  // Ενημέρωση του selected spot αν δεν υπάρχει στα φιλτραρισμένα
  useMemo(() => {
    if (selectedSpot && !processedParkingSpots.find(spot => spot.id === selectedSpot.id)) {
      setSelectedSpot(processedParkingSpots.length > 0 ? processedParkingSpots[0] : null);
    }
  }, [processedParkingSpots, selectedSpot]);

  if (!parkingSpots || parkingSpots.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <p className="text-lg mb-2">Δεν υπάρχουν δεδομένα</p>
            <p className="text-sm">Δεν βρέθηκαν θέσεις στάθμευσης για αυτό το έργο.</p>
          </div>
        </div>
      );
  }

  return (
    <div className="bg-card border rounded-lg shadow-sm flex flex-col h-full">
      <ParkingToolbar 
        selectedSpot={selectedSpot} 
        hasActiveFilters={Object.values(filters).some(value => value.length > 0)}
        onClearFilters={clearFilters}
        totalCount={parkingSpots.length}
        filteredCount={processedParkingSpots.length}
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumnVisibility={toggleColumnVisibility}
      />
      
      {/* Desktop View */}
      <div className="hidden md:flex flex-col flex-grow min-h-0">
         <ParkingTableHeader 
           columns={filteredColumns}
           columnWidths={columnWidths} 
           onColumnResize={handleColumnResize}
           parkingSpots={parkingSpots}
           filters={filters}
           onFilterChange={handleFilterChange}
           sortConfig={sortConfig}
           onSort={handleSort}
         />
         <ScrollArea className="flex-grow">
            <div className="flex flex-col">
                {processedParkingSpots.map((spot) => (
                <ParkingTableRow
                    key={spot.id}
                    spot={spot}
                    columns={filteredColumns}
                    columnWidths={columnWidths}
                    isSelected={spot.id === selectedSpot?.id}
                    onSelect={() => setSelectedSpot(spot)}
                />
                ))}
                {processedParkingSpots.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    <div className="max-w-md mx-auto">
                      <p className="text-lg mb-2">Δεν βρέθηκαν αποτελέσματα</p>
                      <p className="text-sm mb-4">Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης ή να καθαρίσετε όλα τα φίλτρα.</p>
                      <button 
                        onClick={clearFilters}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                      >
                        Καθαρισμός φίλτρων
                      </button>
                    </div>
                  </div>
                )}
            </div>
        </ScrollArea>
      </div>
      
      {/* Mobile View */}
      <div className="md:hidden flex-grow">
          <ParkingTableMobile 
            parkingSpots={processedParkingSpots}
            selectedSpot={selectedSpot}
            onSelectSpot={setSelectedSpot}
          />
      </div>

      {/* Totals */}
      <div className="p-4 border-t bg-muted/20 text-sm font-medium">
        <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Εμφάνιση:</span>
            <span className="text-foreground font-semibold">{processedParkingSpots.length}</span>
            <span>από</span>
            <span className="text-foreground font-semibold">{parkingSpots.length}</span>
            <span>εγγραφές</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span>Σύνολο Τ.Μ.: <span className="text-primary font-semibold">{totals.tm.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
            <span>Σύνολο Τιμής: <span className="text-primary font-semibold">{totals.price.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
            <span>Σύνολο Αντ. Αξίας: <span className="text-primary font-semibold">{totals.value.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
            <span>Σύνολο Αντ. Αξίας Με Συνιδιοκτησία: <span className="text-primary font-semibold">{totals.valueWithVat.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}