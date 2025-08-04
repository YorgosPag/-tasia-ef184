"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Upload, 
  Save, 
  Layers,
  Grid,
  Eye,
  EyeOff,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloorPlanCanvas } from "./FloorPlanCanvas";
import { PolygonEditor } from "./PolygonEditor";
import { LayerManager } from "./LayerManager";

interface FloorPlanViewerProps {
  selectedProperty: string | null;
  selectedFloor: string | null;
  onSelectFloor: (floorId: string) => void;
  onHoverProperty: (propertyId: string | null) => void;
  hoveredProperty: string | null;
  isEditMode: boolean;
}

interface FloorData {
  id: string;
  name: string;
  level: number;
  buildingId: string;
  floorPlanUrl?: string;
  properties: PropertyPolygon[];
}

interface PropertyPolygon {
  id: string;
  name: string;
  type: string;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
  vertices: Array<{ x: number; y: number }>;
  color: string;
  price?: number;
  area?: number;
}

// Mock data - θα αντικατασταθεί με πραγματικά δεδομένα
const mockFloors: FloorData[] = [
  {
    id: "floor-1",
    name: "Υπόγειο",
    level: -1,
    buildingId: "building-1",
    floorPlanUrl: "/mock-floor-plan.pdf",
    properties: [
      {
        id: "prop-1",
        name: "Αποθήκη A1",
        type: "Αποθήκη",
        status: "for-sale",
        color: "#10b981",
        vertices: [
          { x: 100, y: 100 },
          { x: 200, y: 100 },
          { x: 200, y: 180 },
          { x: 100, y: 180 }
        ],
        price: 25000,
        area: 15
      },
      {
        id: "prop-2",
        name: "Στούντιο B1",
        type: "Στούντιο",
        status: "sold",
        color: "#ef4444",
        vertices: [
          { x: 220, y: 100 },
          { x: 350, y: 100 },
          { x: 350, y: 200 },
          { x: 220, y: 200 }
        ],
        price: 85000,
        area: 35
      }
    ]
  },
  {
    id: "floor-2",
    name: "Ισόγειο",
    level: 0,
    buildingId: "building-1",
    properties: []
  }
];

const statusColors = {
  'for-sale': '#10b981',    // Green
  'for-rent': '#3b82f6',    // Blue
  'sold': '#ef4444',        // Red
  'rented': '#f97316',      // Orange
  'reserved': '#eab308',    // Yellow
};

export function FloorPlanViewer({
  selectedProperty,
  selectedFloor,
  onSelectFloor,
  onHoverProperty,
  hoveredProperty,
  isEditMode
}: FloorPlanViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedPolygon, setSelectedPolygon] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentFloor = mockFloors.find(f => f.id === selectedFloor) || mockFloors[0];

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.2));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
  }, []);

  const handlePolygonHover = useCallback((propertyId: string | null) => {
    onHoverProperty(propertyId);
  }, [onHoverProperty]);

  const handlePolygonSelect = useCallback((propertyId: string | null) => {
    setSelectedPolygon(propertyId);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log("Uploading floor plan:", file.name);
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select 
              value={currentFloor.id} 
              onValueChange={onSelectFloor}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockFloors.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id}>
                    {floor.name} ({floor.level >= 0 ? '+' : ''}{floor.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Badge variant="outline" className="text-xs">
              {currentFloor.properties.length} ακίνητα
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* View Controls */}
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs px-2 min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetView}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Display Options */}
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={showGrid ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={showLabels ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowLabels(!showLabels)}
                className="h-8 w-8 p-0"
              >
                {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>

            {/* File Operations */}
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept=".pdf,.dwg,.dxf"
                onChange={handleFileUpload}
                className="hidden"
                id="floor-plan-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('floor-plan-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Φόρτωση
              </Button>
              {isEditMode && (
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Αποθήκευση
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Main Content */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex">
          {/* Canvas Area */}
          <div className="flex-1 relative overflow-hidden bg-gray-50">
            <div
              ref={canvasRef}
              className="w-full h-full relative"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            >
              <FloorPlanCanvas
                floorData={currentFloor}
                selectedProperty={selectedProperty}
                hoveredProperty={hoveredProperty}
                selectedPolygon={selectedPolygon}
                showGrid={showGrid}
                showLabels={showLabels}
                isEditMode={isEditMode}
                onPolygonHover={handlePolygonHover}
                onPolygonSelect={handlePolygonSelect}
              />
              
              {isEditMode && (
                <PolygonEditor
                  floorData={currentFloor}
                  selectedPolygon={selectedPolygon}
                  onPolygonUpdate={() => {}}
                />
              )}
            </div>
          </div>

          {/* Side Panel for Edit Mode */}
          {isEditMode && (
            <div className="w-80 border-l bg-background">
              <Tabs defaultValue="layers" className="h-full">
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
                
                <TabsContent value="layers" className="mt-0 h-[calc(100%-3rem)]">
                  <LayerManager
                    floorData={currentFloor}
                    selectedPolygon={selectedPolygon}
                    onPolygonSelect={setSelectedPolygon}
                  />
                </TabsContent>
                
                <TabsContent value="properties" className="mt-0 h-[calc(100%-3rem)] p-4">
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
          )}
        </div>
      </CardContent>
    </div>
  );
}
