"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterGroup } from "./filters/FilterGroup";
import { ActiveFiltersBar } from "./filters/ActiveFiltersBar";
import { filterConfig, statusRenderOptions, MOCK_DATA } from "./filters/filtersConfig";
import type { FilterState } from "./filters/types";

const initialFilterState: FilterState = {
  project: [],
  building: [],
  floor: [],
  propertyType: [],
  status: [],
};

export function PropertyViewerFilters() {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const handleMultiSelectChange = (filterType: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentArray = prev[filterType] as string[];
      const newArray = checked 
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value);
      
      return {
        ...prev,
        [filterType]: newArray
      };
    });
  };

  const clearFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: (prev[filterType] as string[]).filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilterState);
  };

  const activeFilters = useMemo(() => {
    const active = [];
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value) && value.length > 0) {
        active.push(...value.map(v => ({ type: key as keyof FilterState, value: v })));
      }
    }
    return active;
  }, [filters]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Φίλτρα Αναζήτησης</CardTitle>
          <ActiveFiltersBar
            activeFilters={activeFilters}
            onClearFilter={clearFilter}
            onClearAll={clearAllFilters}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {filterConfig.map((group) => (
            <FilterGroup
              key={group.key}
              title={group.label}
              options={MOCK_DATA[group.key]}
              selected={filters[group.key] as string[]}
              onChange={(value, checked) => handleMultiSelectChange(group.key, value, checked)}
              renderOption={group.key === 'status' ? statusRenderOptions : undefined}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
