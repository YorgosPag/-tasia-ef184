"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FloorData } from "./types";
import { useLayerState } from "@/hooks/useLayerState";
import { useLayerFilters } from "@/hooks/useLayerFilters";
import { LayerFilters } from "./layers/LayerFilters";
import { PropertyLayerItem } from "./layers/PropertyLayerItem";
import { Home } from "lucide-react";

interface LayerManagerProps {
  floorData: FloorData;
  selectedPolygon: string | null;
  onPolygonSelect: (polygonId: string | null) => void;
}

export function LayerManager({
  floorData,
  selectedPolygon,
  onPolygonSelect,
}: LayerManagerProps) {
  const {
    layerStates,
    toggleVisibility,
    toggleLock,
    changeOpacity,
    hideAll,
    showAll,
  } = useLayerState(floorData.properties);

  const {
    filteredProperties,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    uniqueTypes,
    uniqueStatuses,
  } = useLayerFilters(floorData.properties);

  const handleEdit = (propertyId: string) => {
    onPolygonSelect(propertyId);
    // Additional edit logic here
  };

  const handleDelete = (propertyId: string) => {
    // Delete logic here
    console.log("Delete property:", propertyId);
  };

  const handleDuplicate = (propertyId: string) => {
    // Duplicate logic here
    console.log("Duplicate property:", propertyId);
  };

  return (
    <div className="h-full flex flex-col">
      <LayerFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        types={uniqueTypes}
        statuses={uniqueStatuses}
        currentType={filterType}
        currentStatus={filterStatus}
        onChangeType={setFilterType}
        onChangeStatus={setFilterStatus}
        totalCount={filteredProperties.length}
        onShowAll={showAll}
        onHideAll={hideAll}
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Home className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Δεν βρέθηκαν layers</p>
              <p className="text-xs">Δοκιμάστε να αλλάξετε τα φίλτρα</p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <PropertyLayerItem
                key={property.id}
                property={property}
                isSelected={selectedPolygon === property.id}
                layerState={layerStates[property.id]}
                onSelect={() => onPolygonSelect(property.id)}
                onToggleVisibility={() => toggleVisibility(property.id)}
                onToggleLock={() => toggleLock(property.id)}
                onOpacityChange={(val) => changeOpacity(property.id, val)}
                onEdit={() => handleEdit(property.id)}
                onDelete={() => handleDelete(property.id)}
                onDuplicate={() => handleDuplicate(property.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
