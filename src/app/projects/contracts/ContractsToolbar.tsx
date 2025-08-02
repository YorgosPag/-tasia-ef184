'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Minus, Pencil, Plus, Printer, Columns3, FilterX, Check } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { AddContractDialog } from './AddContractDialog';
import { EditContractDialog } from './EditContractDialog';
import { Contract } from './types';

const ToolbarButton = ({ tooltip, children, className, onClick, asChild, disabled }: { tooltip: string, children: React.ReactNode, className?: string, onClick?: () => void, asChild?: boolean, disabled?: boolean }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" className={cn('h-7 w-7', className)} onClick={onClick} asChild={asChild} disabled={disabled}>
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

const DeleteConfirmationDialog = ({ onConfirm, children }: { onConfirm: () => void, children: React.ReactNode }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
        <AlertDialogDescription className="pt-4">
          Είστε βέβαιοι ότι θέλετε να διαγράψετε το επιλεγμένο συμβόλαιο; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className={cn(buttonVariants({ variant: 'destructive' }))}>
          Διαγραφή
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

interface ContractsToolbarProps {
    selectedContract: Contract | null;
    hasActiveFilters?: boolean;
    onClearFilters?: () => void;
    totalCount?: number;
    filteredCount?: number;
    columns?: Array<{ key: string; label: string; }>;
    visibleColumns?: string[];
    onToggleColumnVisibility?: (columnKey: string) => void;
}

export function ContractsToolbar({ 
  selectedContract, 
  hasActiveFilters, 
  onClearFilters, 
  totalCount, 
  filteredCount,
  columns = [],
  visibleColumns = [],
  onToggleColumnVisibility
}: ContractsToolbarProps) {
  const isDocSelected = !!selectedContract;
  const showFilterStats = totalCount !== undefined && filteredCount !== undefined && totalCount !== filteredCount;
  
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowColumnMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-1.5 border-b flex items-center gap-1 shrink-0">
      <AddContractDialog trigger={
          <ToolbarButton tooltip="Νέο Συμβόλαιο" className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400">
              <Plus className="w-4 h-4" />
            </ToolbarButton>
        } />
      <EditContractDialog contract={selectedContract} trigger={
          <ToolbarButton tooltip="Επεξεργασία" className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400" disabled={!isDocSelected}>
              <Pencil className="w-4 h-4" />
            </ToolbarButton>
        } />
      <DeleteConfirmationDialog onConfirm={() => console.log('Delete contract', selectedContract?.id)}>
          <ToolbarButton tooltip="Διαγραφή" className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400" disabled={!isDocSelected}>
              <Minus className="w-4 h-4" />
            </ToolbarButton>
        </DeleteConfirmationDialog>
      <ToolbarButton tooltip="Προβολή" disabled={!isDocSelected}><Eye className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton tooltip="Εκτύπωση"><Printer className="w-4 h-4" /></ToolbarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              ref={buttonRef}
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setShowColumnMenu(!showColumnMenu)}
            >
              <Columns3 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Εμφάνιση Στηλών</p>
          </TooltipContent>
        </Tooltip>

        {showColumnMenu && (
          <div 
            ref={dropdownRef}
            className="absolute top-8 left-0 z-50 w-56 bg-popover border border-border rounded-md shadow-lg py-1"
          >
            <div className="px-3 py-2 text-sm font-medium border-b border-border">
              Εμφάνιση Στηλών
            </div>
            {columns.map((column) => {
              const isChecked = visibleColumns.includes(column.key);
              const isDisabled = visibleColumns.length === 1 && isChecked;
              
              return (
                <div
                  key={column.key}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !isDisabled && onToggleColumnVisibility?.(column.key)}
                >
                  <div className="mr-2 w-4 h-4 flex items-center justify-center">
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span>{column.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <ToolbarButton 
          tooltip="Καθαρισμός Φίλτρων" 
          onClick={onClearFilters}
          className="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400"
        >
          <FilterX className="w-4 h-4" />
        </ToolbarButton>
      )}

      {showFilterStats && (
        <div className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {filteredCount} από {totalCount} εγγραφές
        </div>
      )}
    </div>
  );
}
