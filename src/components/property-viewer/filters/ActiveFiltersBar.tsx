"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, RotateCcw } from "lucide-react";
import type { FilterState, ActiveFilter } from "./types";
import { statusConfig, filterConfig } from "./filtersConfig";

const getLabel = (type: keyof FilterState, value: string): React.ReactNode => {
    if(type === 'status') {
        const config = statusConfig[value as keyof typeof statusConfig];
        return <Badge variant="outline" className={`text-xs ${config.color}`}>{config.label}</Badge>;
    }
    return value;
}

interface ActiveFiltersBarProps {
  activeFilters: ActiveFilter[];
  onClearFilter: (filterType: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFiltersBar({ activeFilters, onClearFilter, onClearAll }: ActiveFiltersBarProps) {
    if (activeFilters.length === 0) return null;

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {activeFilters.map((filter, index) => (
          <Badge key={index} variant="secondary" className="pl-2 pr-1">
            {getLabel(filter.type, filter.value)}
            <button
              onClick={() => onClearFilter(filter.type, filter.value)}
              className="ml-1 hover:bg-black/10 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAll}
          className="text-xs h-7"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Καθαρισμός Όλων
        </Button>
      </div>
    );
}
