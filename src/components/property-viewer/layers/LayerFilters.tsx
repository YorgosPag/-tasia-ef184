"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Search } from "lucide-react";

const statusLabels: Record<string, string> = {
  "for-sale": "Προς Πώληση",
  "for-rent": "Προς Ενοικίαση",
  sold: "Πουλημένο",
  rented: "Ενοικιασμένο",
  reserved: "Δεσμευμένο",
};

interface LayerFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  types: string[];
  statuses: string[];
  currentType: string;
  currentStatus: string;
  onChangeType: (value: string) => void;
  onChangeStatus: (value: string) => void;
  totalCount: number;
  onShowAll: () => void;
  onHideAll: () => void;
}

export function LayerFilters({
  searchQuery,
  onSearchChange,
  types,
  statuses,
  currentType,
  currentStatus,
  onChangeType,
  onChangeStatus,
  totalCount,
  onShowAll,
  onHideAll,
}: LayerFiltersProps) {
  return (
    <div className="p-4 border-b space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Layers Διαχείρισης</h3>
        <Badge variant="secondary" className="text-xs">
          {totalCount} στοιχεία
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Αναζήτηση layer..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 text-xs pl-7"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select value={currentType} onValueChange={onChangeType}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Τύπος" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλοι οι τύποι</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentStatus} onValueChange={onChangeStatus}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Κατάσταση" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλες</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status] || status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs flex-1"
          onClick={onShowAll}
        >
          <Eye className="h-3 w-3 mr-1" />
          Εμφάνιση Όλων
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs flex-1"
          onClick={onHideAll}
        >
          <EyeOff className="h-3 w-3 mr-1" />
          Απόκρυψη Όλων
        </Button>
      </div>
    </div>
  );
}
