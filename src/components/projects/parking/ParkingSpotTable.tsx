'use client';

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Edit, 
  Eye, 
  FileText,
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { ParkingSpot, ParkingFilters } from '@/types/parking';
import { PARKING_TYPE_LABELS, PARKING_STATUS_LABELS, PARKING_STATUS_COLORS } from '@/types/parking';

interface ParkingSpotTableProps {
  spots: ParkingSpot[];
  filters: ParkingFilters;
  selectedSpots: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onEdit?: (spot: ParkingSpot) => void;
  onView?: (spot: ParkingSpot) => void;
  onViewFloorPlan?: (spot: ParkingSpot) => void;
}

type SortField = 'code' | 'type' | 'propertyCode' | 'level' | 'area' | 'price' | 'value' | 'status' | 'owner';
type SortOrder = 'asc' | 'desc';

export function ParkingSpotTable({
  spots,
  filters,
  selectedSpots,
  onSelectionChange,
  onEdit,
  onView,
  onViewFloorPlan
}: ParkingSpotTableProps) {
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Filter spots based on filters
  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      const matchesSearch = filters.searchTerm === '' || 
        spot.code.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        spot.propertyCode.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        spot.owner.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesType = filters.type === 'all' || spot.type === filters.type;
      const matchesStatus = filters.status === 'all' || spot.status === filters.status;
      const matchesLevel = filters.level === 'all' || spot.level.toLowerCase().includes(filters.level);
      const matchesOwner = filters.owner === '' || 
        spot.owner.toLowerCase().includes(filters.owner.toLowerCase());

      const matchesMinArea = filters.minArea === null || spot.area >= filters.minArea;
      const matchesMaxArea = filters.maxArea === null || spot.area <= filters.maxArea;
      const matchesMinPrice = filters.minPrice === null || spot.price >= filters.minPrice;
      const matchesMaxPrice = filters.maxPrice === null || spot.price <= filters.maxPrice;

      return matchesSearch && matchesType && matchesStatus && matchesLevel && 
             matchesOwner && matchesMinArea && matchesMaxArea && matchesMinPrice && matchesMaxPrice;
    });
  }, [spots, filters]);

  // Sort spots
  const sortedSpots = useMemo(() => {
    return [...filteredSpots].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'code':
          aValue = a.code;
          bValue = b.code;
          break;
        case 'type':
          aValue = PARKING_TYPE_LABELS[a.type];
          bValue = PARKING_TYPE_LABELS[b.type];
          break;
        case 'propertyCode':
          aValue = a.propertyCode;
          bValue = b.propertyCode;
          break;
        case 'level':
          aValue = a.level;
          bValue = b.level;
          break;
        case 'area':
          aValue = a.area;
          bValue = b.area;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'status':
          aValue = PARKING_STATUS_LABELS[a.status];
          bValue = PARKING_STATUS_LABELS[b.status];
          break;
        case 'owner':
          aValue = a.owner;
          bValue = b.owner;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }, [filteredSpots, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(sortedSpots.map(spot => spot.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectSpot = (spotId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedSpots, spotId]);
    } else {
      onSelectionChange(selectedSpots.filter(id => id !== spotId));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const allSelected = sortedSpots.length > 0 && selectedSpots.length === sortedSpots.length;
  const someSelected = selectedSpots.length > 0 && selectedSpots.length < sortedSpots.length;

  return (
    <div className="border rounded-lg overflow-hidden">
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              
              <TableHead className="cursor-pointer" onClick={() => handleSort('code')}>
                <div className="flex items-center gap-2">
                  Κωδικός
                  {getSortIcon('code')}
                </div>
              </TableHead>
              
              <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                <div className="flex items-center gap-2">
                  Τύπος
                  {getSortIcon('type')}
                </div>
              </TableHead>
              
              <TableHead className="cursor-pointer" onClick={() => handleSort('propertyCode')}>
                <div className="flex items-center gap-2">
                  Ακίνητο
                  {getSortIcon('propertyCode')}
                </div>
              </TableHead>
              
              <TableHead className="cursor-pointer" onClick={() => handleSort('level')}>
                <div className="flex items-center gap-2">
                  Επίπεδο
                  {getSortIcon('level')}
                </div>
              </TableHead>
              
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort('area')}>
                <div className="flex items-center gap-2 justify-end">
                  Τ.Μ.
                  {getSortIcon('area')}
                </div>
              </TableHead>
              
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-2 justify-end">
                  Τιμή
                  {getSortIcon('price')}
                </div>
              </TableHead>
              
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort('value')}>
                <div className="flex items-center gap-2 justify-end">
                  Αντ.Αξία
                  {getSortIcon('value')}
                </div>
              </TableHead>
              
              <TableHead className="cursor-pointer text-right">
                <div className="flex items-center gap-2 justify-end">
                  Αντ.Αξία Με Συνδικτηκότα
                </div>
              </TableHead>
              
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-2">
                  Κατάσταση
                  {getSortIcon('status')}
                </div>
              </TableHead>
              
              <TableHead className="cursor-pointer" onClick={() => handleSort('owner')}>
                <div className="flex items-center gap-2">
                  Ιδιοκτήτης
                  {getSortIcon('owner')}
                </div>
              </TableHead>
              
              <TableHead>Κάτοψη</TableHead>
              <TableHead>Κατασκευασθείς Από</TableHead>
              <TableHead className="w-12">Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {sortedSpots.map((spot) => (
              <TableRow 
                key={spot.id}
                className={cn(
                  "hover:bg-muted/50",
                  selectedSpots.includes(spot.id) && "bg-muted/30"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedSpots.includes(spot.id)}
                    onCheckedChange={(checked) => handleSelectSpot(spot.id, checked as boolean)}
                  />
                </TableCell>
                
                <TableCell className="font-medium">
                  {spot.code}
                </TableCell>
                
                <TableCell>
                  {PARKING_TYPE_LABELS[spot.type]}
                </TableCell>
                
                <TableCell>
                  {spot.propertyCode}
                </TableCell>
                
                <TableCell>
                  {spot.level}
                </TableCell>
                
                <TableCell className="text-right">
                  {spot.area.toFixed(2)}
                </TableCell>
                
                <TableCell className="text-right">
                  {formatCurrency(spot.price)}
                </TableCell>
                
                <TableCell className="text-right">
                  {formatCurrency(spot.value)}
                </TableCell>
                
                <TableCell className="text-right">
                  {formatCurrency(spot.valueWithSyndicate)}
                </TableCell>
                
                <TableCell>
                  <Badge className={cn("text-xs", PARKING_STATUS_COLORS[spot.status])}>
                    {PARKING_STATUS_LABELS[spot.status]}
                  </Badge>
                </TableCell>
                
                <TableCell className="max-w-[200px] truncate">
                  {spot.owner}
                </TableCell>
                
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onViewFloorPlan?.(spot)}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </TableCell>
                
                <TableCell className="max-w-[150px] truncate">
                  {spot.constructedBy}
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(spot)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Προβολή
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(spot)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Επεξεργασία
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewFloorPlan?.(spot)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Κάτοψη
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {sortedSpots.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Δεν βρέθηκαν θέσεις στάθμευσης που να ταιριάζουν με τα κριτήρια αναζήτησης.
          </div>
        )}
      </ScrollArea>
    </div>
  );
}