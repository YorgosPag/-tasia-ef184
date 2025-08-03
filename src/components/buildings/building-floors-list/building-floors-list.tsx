"use client";

import React, { useState } from "react";
import { useFloors, useFloorForm, useFloorActions } from "./building-floors-hooks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BuildingFloorsHeader } from "./building-floors-header";
import { BuildingFloorsLoading } from "./building-floors-loading";
import { BuildingFloorsTable } from "./building-floors-table";
import { BuildingFloorsEmptyState } from "./building-floors-empty-state";
import { NewFloorDialog } from "@/components/buildings/NewFloorDialog";
import { Building } from "@/lib/types/project-types";
import { useAuth } from "@/hooks/use-auth";

interface BuildingFloorsListProps {
  building: Building;
}

export function BuildingFloorsList({ building }: BuildingFloorsListProps) {
  const { isEditor } = useAuth();
  const { floors, isLoadingFloors, refetchFloors } = useFloors(building.id);
  const { form } = useFloorForm();
  
  const {
    isDialogOpen,
    isSubmitting,
    handleDialogOpenChange,
    onSubmitFloor,
    handleRowClick,
  } = useFloorActions(building, form, refetchFloors);

  return (
    <Card>
      <CardHeader>
        <BuildingFloorsHeader 
          isEditor={isEditor} 
          onAddNew={() => handleDialogOpenChange(true)} 
        />
      </CardHeader>
      <CardContent>
        {isLoadingFloors ? (
          <BuildingFloorsLoading />
        ) : floors.length > 0 ? (
          <BuildingFloorsTable 
            floors={floors} 
            onRowClick={handleRowClick} 
          />
        ) : (
          <BuildingFloorsEmptyState />
        )}
      </CardContent>
      <NewFloorDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        form={form}
        onSubmit={form.handleSubmit(onSubmitFloor)}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
