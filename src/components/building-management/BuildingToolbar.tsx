'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Minus, 
  Plus, 
  Save, 
  FileText, 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Eye,
  Edit,
  Copy,
  Trash2,
  Archive,
  Star,
  Share,
  Calendar,
  MapPin,
  BarChart3,
  Zap,
  AlertCircle,
  X
} from "lucide-react";
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ToolbarButtonProps {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  disabled?: boolean;
  badge?: string | number;
}

function ToolbarButton({ 
  tooltip, 
  children, 
  onClick, 
  className, 
  variant = "ghost",
  disabled = false,
  badge
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative">
          <Button 
            variant={variant} 
            size="sm" 
            className={cn("h-8 w-8 p-0", className)} 
            onClick={onClick}
            disabled={disabled}
          >
            {children}
          </Button>
          {badge && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
            >
              {badge}
            </Badge>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface QuickSearchProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

function QuickSearch({ onSearch, placeholder = "Γρήγορη αναζήτηση..." }: QuickSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative flex-1 max-w-xs">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-7 h-8 text-xs bg-muted/50 border-muted-foreground/20"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={() => handleSearch('')}
        >
          ×
        </Button>
      )}
    </div>
  );
}

export function BuildingToolbar() {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleNewBuilding = () => {
    console.log('Creating new building...');
  };

  const handleEditBuilding = () => {
    console.log('Editing building...');
  };

  const handleDeleteBuilding = () => {
    console.log('Deleting building...');
  };

  const handleSearch = (term: string) => {
    console.log('Searching for:', term);
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleImport = () => {
    console.log('Importing data...');
  };

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  return (
    <TooltipProvider>
      <div className="border-b bg-muted/30 backdrop-blur-sm">
        {/* Main Toolbar */}
        <div className="p-2 flex items-center gap-1">
          {/* Primary Actions */}
          <div className="flex items-center gap-1 mr-3">
            <ToolbarButton 
              tooltip="Νέο Κτίριο (Ctrl+N)" 
              onClick={handleNewBuilding}
              className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20"
            >
              <Plus className="w-4 h-4" />
            </ToolbarButton>
            
            <ToolbarButton 
              tooltip="Επεξεργασία Επιλεγμένου (Ctrl+E)" 
              onClick={handleEditBuilding}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              disabled={selectedItems.length === 0}
            >
              <Edit className="w-4 h-4" />
            </ToolbarButton>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div>
                  <ToolbarButton 
                    tooltip="Διαγραφή Επιλεγμένου (Delete)" 
                    className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    disabled={selectedItems.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </ToolbarButton>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
                  <AlertDialogDescription>
                    Είστε σίγουροι ότι θέλετε να διαγράψετε {selectedItems.length} κτίριο/α; 
                    Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteBuilding}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Διαγραφή
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Search */}
          <QuickSearch onSearch={handleSearch} />

          <div className="w-px h-6 bg-border mx-1" />

          {/* View and Sort Actions */}
          <div className="flex items-center gap-1">
            <ToolbarButton 
              tooltip={`Ταξινόμηση ${sortDirection === 'asc' ? 'Αύξουσα' : 'Φθίνουσα'}`}
              onClick={toggleSort}
            >
              {sortDirection === 'asc' ? 
                <SortAsc className="w-4 h-4" /> : 
                <SortDesc className="w-4 h-4" />
              }
            </ToolbarButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <ToolbarButton 
                    tooltip="Φίλτρα και Προβολή"
                    badge={activeFilters.length > 0 ? activeFilters.length : undefined}
                  >
                    <Filter className="w-4 h-4" />
                  </ToolbarButton>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Φίλτρα Κτιρίων</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={activeFilters.includes('active')}>
                  Ενεργά Κτίρια
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={activeFilters.includes('construction')}>
                  Υπό Κατασκευή
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={activeFilters.includes('planned')}>
                  Σχεδιασμένα
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={activeFilters.includes('completed')}>
                  Ολοκληρωμένα
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={activeFilters.includes('residential')}>
                  Κατοικίες
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={activeFilters.includes('commercial')}>
                  Εμπορικά
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={activeFilters.includes('mixed')}>
                  Μικτής Χρήσης
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveFilters([])}>
                  <X className="w-4 h-4 mr-2" />
                  Καθαρισμός Φίλτρων
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ToolbarButton 
              tooltip="Ανανέωση Δεδομένων (F5)"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Data Actions */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <ToolbarButton tooltip="Εξαγωγή Δεδομένων">
                    <Download className="w-4 h-4" />
                  </ToolbarButton>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Εξαγωγή σε:</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExport}>
                  <FileText className="w-4 h-4 mr-2" />
                  Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF Αναφορά
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Στατιστικά Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Χρονοδιάγραμμα
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ToolbarButton 
              tooltip="Εισαγωγή Δεδομένων"
              onClick={handleImport}
            >
              <Upload className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="flex-1" />

          {/* Advanced Tools */}
          <div className="flex items-center gap-1">
            <ToolbarButton 
              tooltip="Προχωρημένα Εργαλεία"
              onClick={toggleAdvancedMode}
              variant={isAdvancedMode ? "default" : "ghost"}
              className={isAdvancedMode ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : ""}
            >
              <Zap className="w-4 h-4" />
            </ToolbarButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <ToolbarButton tooltip="Ρυθμίσεις Προβολής">
                    <Settings className="w-4 h-4" />
                  </ToolbarButton>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Ρυθμίσεις</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  Προσαρμογή Στηλών
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Save className="w-4 h-4 mr-2" />
                  Αποθήκευση Προβολής
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Επαναφορά Προεπιλογών
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Προτιμήσεις Χρήστη
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ToolbarButton 
              tooltip="Βοήθεια και Οδηγίες (F1)"
            >
              <HelpCircle className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Advanced Toolbar - Shows when advanced mode is enabled */}
        {isAdvancedMode && (
          <div className="px-2 pb-2 border-t border-border/50">
            <div className="flex items-center gap-1 pt-2">
              <ToolbarButton 
                tooltip="Αντιγραφή Επιλεγμένων"
                disabled={selectedItems.length === 0}
              >
                <Copy className="w-4 h-4" />
              </ToolbarButton>
              
              <ToolbarButton 
                tooltip="Αρχειοθέτηση"
                disabled={selectedItems.length === 0}
              >
                <Archive className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton 
                tooltip="Προσθήκη στα Αγαπημένα"
                disabled={selectedItems.length === 0}
              >
                <Star className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton 
                tooltip="Κοινοποίηση"
                disabled={selectedItems.length === 0}
              >
                <Share className="w-4 h-4" />
              </ToolbarButton>

              <div className="w-px h-6 bg-border mx-2" />

              <ToolbarButton 
                tooltip="Προβολή σε Χάρτη"
                disabled={selectedItems.length === 0}
              >
                <MapPin className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton 
                tooltip="Δημιουργία Αναφοράς"
                disabled={selectedItems.length === 0}
              >
                <BarChart3 className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton 
                tooltip="Προγραμματισμός Επίσκεψης"
                disabled={selectedItems.length === 0}
              >
                <Calendar className="w-4 h-4" />
              </ToolbarButton>

              <div className="flex-1" />

              {/* Status Indicators */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {selectedItems.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedItems.length} επιλεγμένα
                  </Badge>
                )}
                {activeFilters.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {activeFilters.length} φίλτρα ενεργά
                  </Badge>
                )}
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Συγχρονισμένο
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="px-2 pb-2 border-t border-border/50">
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-muted-foreground">Ενεργά φίλτρα:</span>
              <div className="flex flex-wrap gap-1">
                {activeFilters.map((filter) => (
                  <Badge 
                    key={filter} 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 flex items-center gap-1"
                  >
                    {filter}
                    <button
                      onClick={() => setActiveFilters(prev => prev.filter(f => f !== filter))}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilters([])}
                  className="h-6 px-2 text-xs"
                >
                  Καθαρισμός όλων
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
