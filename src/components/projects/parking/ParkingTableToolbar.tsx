'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  Minus, 
  Save, 
  RefreshCw, 
  HelpCircle,
  Car,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ParkingFilters, ParkingStats } from '@/types/parking';
import { PARKING_TYPE_LABELS, PARKING_STATUS_LABELS } from '@/types/parking';

interface ToolbarButtonProps {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

function ToolbarButton({ 
  tooltip, 
  children, 
  onClick, 
  className, 
  disabled, 
  variant = "ghost",
  size = "icon"
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant={variant}
          size={size}
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

interface ParkingTableToolbarProps {
  filters: ParkingFilters;
  onFiltersChange: (filters: Partial<ParkingFilters>) => void;
  stats: ParkingStats;
  onExport?: () => void;
  onImport?: () => void;
  onAdd?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onRefresh?: () => void;
  selectedCount?: number;
}

export function ParkingTableToolbar({
  filters,
  onFiltersChange,
  stats,
  onExport,
  onImport,
  onAdd,
  onDelete,
  onSave,
  onRefresh,
  selectedCount = 0
}: ParkingTableToolbarProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Action Toolbar */}
        <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ToolbarButton 
                tooltip="Νέα Θέση Στάθμευσης" 
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                onClick={onAdd}
              >
                <Plus className="w-4 h-4" />
              </ToolbarButton>
              
              <ToolbarButton 
                tooltip="Διαγραφή Επιλεγμένων" 
                className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                onClick={onDelete}
                disabled={selectedCount === 0}
              >
                <Minus className="w-4 h-4" />
              </ToolbarButton>
              
              <div className="w-px h-6 bg-border mx-1" />
              
              <ToolbarButton 
                tooltip="Αποθήκευση Αλλαγών"
                onClick={onSave}
              >
                <Save className="w-4 h-4" />
              </ToolbarButton>
              
              <ToolbarButton 
                tooltip="Ανανέωση Δεδομένων"
                onClick={onRefresh}
              >
                <RefreshCw className="w-4 h-4" />
              </ToolbarButton>
              
              <div className="w-px h-6 bg-border mx-1" />
              
              <ToolbarButton 
                tooltip="Εξαγωγή Δεδομένων"
                onClick={onExport}
              >
                <Download className="w-4 h-4" />
              </ToolbarButton>
              
              <ToolbarButton 
                tooltip="Εισαγωγή Δεδομένων"
                onClick={onImport}
              >
                <Upload className="w-4 h-4" />
              </ToolbarButton>
            </div>
            
            {selectedCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedCount} επιλεγμένες
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <ToolbarButton 
              tooltip="Βοήθεια"
            >
              <HelpCircle className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
            <Car className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium">{stats.totalSpots}</div>
              <div className="text-xs text-muted-foreground">Σύνολο</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div>
              <div className="text-sm font-medium">{stats.soldSpots}</div>
              <div className="text-xs text-muted-foreground">Πουλημένες</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <div>
              <div className="text-sm font-medium">{stats.ownerSpots}</div>
              <div className="text-xs text-muted-foreground">Οικοπεδούχου</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <div>
              <div className="text-sm font-medium">{stats.availableSpots}</div>
              <div className="text-xs text-muted-foreground">Διαθέσιμες</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
            <BarChart3 className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-sm font-medium">{formatCurrency(stats.totalValue)}</div>
              <div className="text-xs text-muted-foreground">Συν. Αξία</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <div>
              <div className="text-sm font-medium">{stats.totalArea.toFixed(1)} m²</div>
              <div className="text-xs text-muted-foreground">Εμβαδόν</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 p-4 bg-card border rounded-lg">
          <div className="lg:col-span-2 space-y-2">
            <Label htmlFor="search" className="text-xs font-medium flex items-center gap-1">
              <Search className="w-3 h-3" />
              Αναζήτηση
            </Label>
            <Input
              id="search"
              placeholder="Κωδικός, ιδιοκτήτης, ακίνητο..."
              value={filters.searchTerm}
              onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type-filter" className="text-xs font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Τύπος
            </Label>
            <Select value={filters.type} onValueChange={(value) => onFiltersChange({ type: value })}>
              <SelectTrigger id="type-filter" className="h-9">
                <SelectValue placeholder="Όλοι οι τύποι" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλοι οι τύποι</SelectItem>
                {Object.entries(PARKING_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-xs font-medium">Κατάσταση</Label>
            <Select value={filters.status} onValueChange={(value) => onFiltersChange({ status: value })}>
              <SelectTrigger id="status-filter" className="h-9">
                <SelectValue placeholder="Όλες οι καταστάσεις" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
                {Object.entries(PARKING_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level-filter" className="text-xs font-medium">Επίπεδο</Label>
            <Select value={filters.level} onValueChange={(value) => onFiltersChange({ level: value })}>
              <SelectTrigger id="level-filter" className="h-9">
                <SelectValue placeholder="Όλα τα επίπεδα" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλα τα επίπεδα</SelectItem>
                <SelectItem value="basement">Υπόγειο</SelectItem>
                <SelectItem value="ground">Ισόγειο</SelectItem>
                <SelectItem value="first">1ος Όροφος</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner-filter" className="text-xs font-medium">Ιδιοκτήτης</Label>
            <Input
              id="owner-filter"
              placeholder="Φίλτρο ιδιοκτήτη..."
              value={filters.owner}
              onChange={(e) => onFiltersChange({ owner: e.target.value })}
              className="h-9"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}