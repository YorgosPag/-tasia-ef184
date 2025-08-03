'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Save, 
  RefreshCw, 
  HelpCircle,
  Home,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property, PropertyFilters } from '@/types/property';
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, PROPERTY_STATUS_COLORS } from '@/types/property';

interface ToolbarButtonProps {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

function ToolbarButton({ tooltip, children, onClick, className, disabled }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8", className)} 
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface PropertyListProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  filters: PropertyFilters;
  onFiltersChange: (filters: Partial<PropertyFilters>) => void;
}

export function PropertyList({
  properties,
  selectedProperty,
  onSelectProperty,
  filters,
  onFiltersChange
}: PropertyListProps) {
  const [selectedCount, setSelectedCount] = useState(0);

  // Filter properties based on filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = filters.searchTerm === '' || 
      property.code.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      property.buyer?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      property.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesType = filters.type === 'all' || property.type === filters.type;
    const matchesStatus = filters.status === 'all' || property.status === filters.status;
    const matchesFloor = filters.floor === 'all' || property.floor === filters.floor;
    const matchesBuilding = filters.building === 'all' || property.building === filters.building;

    const matchesMinArea = filters.minArea === null || property.area >= filters.minArea;
    const matchesMaxArea = filters.maxArea === null || property.area <= filters.maxArea;
    const matchesMinPrice = filters.minPrice === null || property.price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || property.price <= filters.maxPrice;

    return matchesSearch && matchesType && matchesStatus && matchesFloor && 
           matchesBuilding && matchesMinArea && matchesMaxArea && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="w-[300px] bg-card border rounded-lg flex flex-col shrink-0 shadow-sm">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Ακίνητα</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {filteredProperties.length}
          </Badge>
        </div>
      </CardHeader>

      {/* Filters */}
      <div className="px-4 pb-3 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-xs font-medium flex items-center gap-1">
            <Search className="w-3 h-3" />
            Αναζήτηση
          </Label>
          <Input
            id="search"
            placeholder="Κωδικός, αγοραστής..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="h-8 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="type-filter" className="text-xs font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Τύπος
            </Label>
            <Select value={filters.type} onValueChange={(value) => onFiltersChange({ type: value })}>
              <SelectTrigger id="type-filter" className="h-8 text-xs">
                <SelectValue placeholder="Όλοι" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλοι οι τύποι</SelectItem>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-xs font-medium">Κατάσταση</Label>
            <Select value={filters.status} onValueChange={(value) => onFiltersChange({ status: value })}>
              <SelectTrigger id="status-filter" className="h-8 text-xs">
                <SelectValue placeholder="Όλες" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλες</SelectItem>
                {Object.entries(PROPERTY_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <TooltipProvider>
        <div className="px-2 py-1.5 border-y bg-muted/30 flex items-center gap-1">
          <ToolbarButton 
            tooltip="Νέο Ακίνητο" 
            className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
          >
            <Plus className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton 
            tooltip="Διαγραφή" 
            className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
            disabled={selectedCount === 0}
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <ToolbarButton tooltip="Αποθήκευση">
            <Save className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton tooltip="Ανανέωση">
            <RefreshCw className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="flex-1" />
          
          <ToolbarButton tooltip="Βοήθεια">
            <HelpCircle className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </TooltipProvider>

      {/* Properties List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-sm p-3",
                selectedProperty?.id === property.id && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => onSelectProperty(property)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{property.code}</span>
                  </div>
                  <Badge className={cn("text-xs", PROPERTY_STATUS_COLORS[property.status])}>
                    {PROPERTY_STATUS_LABELS[property.status]}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <div>{PROPERTY_TYPE_LABELS[property.type]}</div>
                  <div>Όροφος: {property.floor}</div>
                  <div>Εμβαδόν: {property.area} m²</div>
                </div>

                {property.buyer && (
                  <div className="text-xs text-muted-foreground truncate">
                    Αγοραστής: {property.buyer}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {filteredProperties.length === 0 && (
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Δεν βρέθηκαν ακίνητα
        </div>
      )}
    </div>
  );
}
