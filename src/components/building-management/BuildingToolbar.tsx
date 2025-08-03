'use client';

import React from 'react';
import { useToolbarState } from '@/hooks/useToolbarState';
import { ToolbarButton } from '@/components/toolbar/ToolbarButton';
import { QuickSearch } from '@/components/toolbar/QuickSearch';
import { FilterDropdown } from '@/components/toolbar/FilterDropdown';
import { ExportDropdown } from '@/components/toolbar/ExportDropdown';
import { SettingsDropdown } from '@/components/toolbar/SettingsDropdown';
import { AdvancedToolbar } from '@/components/toolbar/AdvancedToolbar';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Plus,
  Edit,
  Trash2,
  SortAsc,
  SortDesc,
  RefreshCw,
  Zap,
} from 'lucide-react';

export function BuildingToolbar() {
  const {
    isAdvancedMode,
    selectedItems,
    sortDirection,
    activeFilters,
    handleSearch,
    handleRefresh,
    toggleSort,
    toggleAdvancedMode,
    handleFilterToggle,
    clearFilters,
    handleExport,
    handleEditBuilding,
    handleNewBuilding,
    handleDeleteBuilding,
  } = useToolbarState();

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
                    Είστε σίγουροι ότι θέλετε να διαγράψετε {selectedItems.length}{" "}
                    κτίριο/α; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
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
              tooltip={`Ταξινόμηση ${sortDirection === "asc" ? "Αύξουσα" : "Φθίνουσα"}`}
              onClick={toggleSort}
            >
              {sortDirection === "asc" ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </ToolbarButton>
            <FilterDropdown
              activeFilters={activeFilters}
              onFilterToggle={handleFilterToggle}
              onClearFilters={clearFilters}
            />
            <ToolbarButton
              tooltip="Ανανέωση Δεδομένων (F5)"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          <ExportDropdown onExport={handleExport} />

          <div className="flex-1" />

          {/* Advanced Tools */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              tooltip="Προχωρημένα Εργαλεία"
              onClick={toggleAdvancedMode}
              variant={isAdvancedMode ? "default" : "ghost"}
              className={
                isAdvancedMode
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : ""
              }
            >
              <Zap className="w-4 h-4" />
            </ToolbarButton>
            <SettingsDropdown />
          </div>
        </div>
        {isAdvancedMode && (
          <AdvancedToolbar
            selectedItems={selectedItems}
            activeFilters={activeFilters}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
