"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Palette } from "lucide-react";
import { LayerManager } from "../LayerManager";
import type { FloorData } from "../types";

interface EditSidebarProps {
  floorData: FloorData;
  selectedPolygon: string | null;
  onPolygonSelect: (polygonId: string | null) => void;
}

export function EditSidebar({
  floorData,
  selectedPolygon,
  onPolygonSelect,
}: EditSidebarProps) {
  return (
    <div className="w-80 border-l bg-background">
      <Tabs defaultValue="layers" className="h-full flex flex-col">
        <TabsList className="grid grid-cols-2 m-2">
          <TabsTrigger value="layers">
            <Layers className="h-4 w-4 mr-2" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="properties">
            <Palette className="h-4 w-4 mr-2" />
            Ιδιότητες
          </TabsTrigger>
        </TabsList>
        <TabsContent value="layers" className="mt-0 flex-1 overflow-auto">
          <LayerManager
            floorData={floorData}
            selectedPolygon={selectedPolygon}
            onPolygonSelect={onPolygonSelect}
          />
        </TabsContent>
        <TabsContent value="properties" className="mt-0 p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Ιδιότητες Polygon</h4>
            {selectedPolygon ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Επιλεγμένο: {selectedPolygon}
                </p>
                {/* Property editing controls will go here */}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Επιλέξτε ένα polygon για επεξεργασία
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
