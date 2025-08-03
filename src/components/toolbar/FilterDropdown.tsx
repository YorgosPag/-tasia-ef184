'use client';

import React from "react";
import { ToolbarButton } from "./ToolbarButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Filter, X } from "lucide-react";

const filterOptions = [
    { label: 'Ενεργά Κτίρια', value: 'active' },
    { label: 'Υπό Κατασκευή', value: 'construction' },
    { label: 'Σχεδιασμένα', value: 'planned' },
    { label: 'Ολοκληρωμένα', value: 'completed' },
];

const categoryFilterOptions = [
    { label: 'Κατοικίες', value: 'residential' },
    { label: 'Εμπορικά', value: 'commercial' },
    { label: 'Μικτής Χρήσης', value: 'mixed' },
];

interface FilterDropdownProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  onClearFilters: () => void;
}

export function FilterDropdown({
  activeFilters,
  onFilterToggle,
  onClearFilters,
}: FilterDropdownProps) {
  return (
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
        <DropdownMenuLabel>Φίλτρα Κατάστασης</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filterOptions.map(option => (
            <DropdownMenuCheckboxItem
                key={option.value}
                checked={activeFilters.includes(option.value)}
                onCheckedChange={() => onFilterToggle(option.value)}
            >
                {option.label}
            </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Φίλτρα Κατηγορίας</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {categoryFilterOptions.map(option => (
             <DropdownMenuCheckboxItem
                key={option.value}
                checked={activeFilters.includes(option.value)}
                onCheckedChange={() => onFilterToggle(option.value)}
            >
                {option.label}
            </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onClearFilters}>
          <X className="w-4 h-4 mr-2" />
          Καθαρισμός Φίλτρων
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
