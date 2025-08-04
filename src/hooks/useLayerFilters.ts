"use client";

import { useState, useMemo } from "react";
import type { PropertyPolygon } from "@/components/property-viewer/types";

export function useLayerFilters(properties: PropertyPolygon[]) {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (filterType !== "all" && property.type !== filterType) return false;
      if (filterStatus !== "all" && property.status !== filterStatus)
        return false;
      if (
        searchQuery &&
        !property.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [properties, filterType, filterStatus, searchQuery]);

  const uniqueTypes = useMemo(
    () => Array.from(new Set(properties.map((p) => p.type))),
    [properties],
  );
  const uniqueStatuses = useMemo(
    () => Array.from(new Set(properties.map((p) => p.status))),
    [properties],
  );

  return {
    filteredProperties,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    uniqueTypes,
    uniqueStatuses,
  };
}
