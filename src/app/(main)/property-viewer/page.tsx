"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Filter, Settings } from "lucide-react";

import { usePropertyViewer } from "@/hooks/use-property-viewer";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { EditModeToggle } from "@/components/property-viewer/EditModeToggle";
import { PropertySidebar } from "@/components/property-viewer/PropertySidebar";
import { PropertyInspectorPanel } from "@/components/property-viewer/PropertyInspectorPanel";
import { FloorPlanViewer } from "@/components/property-viewer/FloorPlanViewer";
import { PropertyViewerFilters } from "@/components/property-viewer/PropertyViewerFilters";

export default function PropertyViewerPage() {
  const { isEditor } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    properties,
    selectedProperty,
    hoveredProperty,
    selectedFloor,
    isLoading,
    setSelectedProperty,
    setHoveredProperty,
    setSelectedFloor,
  } = usePropertyViewer();

  const { inputValue, handleSearchChange, filteredProperties } =
    usePropertySearch(properties, selectedProperty, setSelectedProperty);

  const toggleEditMode = () => {
    if (isEditor) {
      console.log('Toggle Edit Mode - Current:', isEditMode, 'New:', !isEditMode);
      setIsEditMode((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Προβολή Ακινήτων
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            Φίλτρα
          </Button>
          <EditModeToggle
            isEditor={isEditor}
            isEditMode={isEditMode}
            toggleEditMode={toggleEditMode}
          />
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Ρυθμίσεις
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-6">
          <PropertyViewerFilters />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 px-6 pb-6 overflow-hidden">
        {/* Properties List - 2/12 */}
        <PropertySidebar
            inputValue={inputValue}
            handleSearchChange={handleSearchChange}
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelectProperty={setSelectedProperty}
            isLoading={isLoading}
        />

        {/* Floor Plan Viewer - 8/12 */}
        <div className="col-span-8 h-full bg-card rounded-lg">
            <FloorPlanViewer
                selectedProperty={selectedProperty}
                selectedFloor={selectedFloor}
                onSelectFloor={setSelectedFloor}
                onHoverProperty={setHoveredProperty}
                hoveredProperty={hoveredProperty}
                isEditMode={isEditMode}
            />
        </div>

        {/* Right Panel - 2/12 */}
        <PropertyInspectorPanel
            selectedProperty={selectedProperty}
            hoveredProperty={hoveredProperty}
        />
      </div>
    </div>
  );
}
