"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit3, 
  Copy, 
  Lock, 
  Unlock,
  Home,
  Building,
  ChevronDown,
  ChevronRight,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface FloorData {
  id: string;
  name: string;
  level: number;
  buildingId: string;
  floorPlanUrl?: string;
  properties: PropertyPolygon[];
}

interface LayerManagerProps {
  floorData: FloorData;
  selectedPolygon: string | null;
  onPolygonSelect: (polygonId: string | null) => void;
}

interface LayerState {
  visible: boolean;
  locked: boolean;
  opacity: number;
}

const statusConfig = {
  'for-sale': {
    label: 'Προς Πώληση',
    color: '#10b981',
    bgColor: 'bg-green-100 text-green-800 border-green-200',
  },
  'for-rent': {
    label: 'Προς Ενοικίαση',
    color: '#3b82f6',
    bgColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  'sold': {
    label: 'Πουλημένο',
    color: '#ef4444',
    bgColor: 'bg-red-100 text-red-800 border-red-200',
  },
  'rented': {
    label: 'Ενοικιασμένο',
    color: '#f97316',
    bgColor: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  'reserved': {
    label: 'Δεσμευμένο',
    color: '#eab308',
    bgColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
};

const propertyTypeIcons = {
  'Στούντιο': Home,
  'Γκαρσονιέρα': Home,
  'Διαμέρισμα 2Δ': Home,
  'Διαμέρισμα 3Δ': Home,
  'Μεζονέτα': Building,
  'Κατάστημα': Building,
  'Αποθήκη': Building,
};

function PropertyLayerItem({
  property,
  isSelected,
  layerState,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onOpacityChange,
  onEdit,
  onDelete,
  onDuplicate
}: {
  property: PropertyPolygon;
  isSelected: boolean;
  layerState: LayerState;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onOpacityChange: (opacity: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const statusInfo = statusConfig[property.status];
  const IconComponent = propertyTypeIcons[property.type as keyof typeof propertyTypeIcons] || Home;

  return (
    <div className={cn(
      "border rounded-lg p-3 space-y-2 transition-colors",
      isSelected ? "border-violet-200 bg-violet-50" : "border-border"
    )}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
        
        <div 
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={onSelect}
        >
          <IconComponent className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate">{property.name}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onToggleVisibility}
          >
            {layerState.visible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onToggleLock}
          >
            {layerState.locked ? (
              <Lock className="h-3 w-3 text-muted-foreground" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Type and Status */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{property.type}</span>
        <Badge 
          variant="outline" 
          className={cn("text-xs", statusInfo.bgColor)}
        >
          {statusInfo.label}
        </Badge>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-3 pt-2 border-t">
          {/* Color */}
          <div className="flex items-center gap-2">
            <Label className="text-xs">Χρώμα:</Label>
            <div 
              className="w-6 h-4 rounded border"
              style={{ backgroundColor: property.color }}
            />
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Palette className="h-3 w-3 mr-1" />
              Αλλαγή
            </Button>
          </div>

          {/* Opacity */}
          <div className="space-y-1">
            <Label className="text-xs">Διαφάνεια: {Math.round(layerState.opacity * 100)}%</Label>
            <Slider
              value={[layerState.opacity * 100]}
              onValueChange={([value]) => onOpacityChange(value / 100)}
              max={100}
              step={10}
              className="w-full"
            />
          </div>

          {/* Properties */}
          {(property.price || property.area) && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {property.price && (
                <div>
                  <span className="text-muted-foreground">Τιμή:</span>
                  <div className="font-medium text-green-600">
                    {property.price.toLocaleString('el-GR')}€
                  </div>
                </div>
              )}
              {property.area && (
                <div>
                  <span className="text-muted-foreground">Εμβαδόν:</span>
                  <div className="font-medium">{property.area}τμ</div>
                </div>
              )}
            </div>
          )}

          {/* Vertices Info */}
          <div className="text-xs text-muted-foreground">
            Κόμβοι: {property.vertices.length}
          </div>

          {/* Actions */}
          <div className="flex gap-1 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs flex-1"
              onClick={onEdit}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Επεξ.
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs flex-1"
              onClick={onDuplicate}
            >
              <Copy className="h-3 w-3 mr-1" />
              Αντιγρ.
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function LayerManager({
  floorData,
  selectedPolygon,
  onPolygonSelect
}: LayerManagerProps) {
  const [layerStates, setLayerStates] = useState<Record<string, LayerState>>(() => {
    const initialStates: Record<string, LayerState> = {};
    floorData.properties.forEach(property => {
      initialStates[property.id] = {
        visible: true,
        locked: false,
        opacity: 0.7
      };
    });
    return initialStates;
  });

  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter properties
  const filteredProperties = floorData.properties.filter(property => {
    if (filterType !== "all" && property.type !== filterType) return false;
    if (filterStatus !== "all" && property.status !== filterStatus) return false;
    if (searchQuery && !property.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Get unique types and statuses for filters
  const uniqueTypes = Array.from(new Set(floorData.properties.map(p => p.type)));
  const uniqueStatuses = Array.from(new Set(floorData.properties.map(p => p.status)));

  const handleToggleVisibility = (propertyId: string) => {
    setLayerStates(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        visible: !prev[propertyId].visible
      }
    }));
  };

  const handleToggleLock = (propertyId: string) => {
    setLayerStates(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        locked: !prev[propertyId].locked
      }
    }));
  };

  const handleOpacityChange = (propertyId: string, opacity: number) => {
    setLayerStates(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        opacity
      }
    }));
  };

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

  const handleSelectAll = () => {
    // Select all visible layers
  };

  const handleHideAll = () => {
    setLayerStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(id => {
        newStates[id] = { ...newStates[id], visible: false };
      });
      return newStates;
    });
  };

  const handleShowAll = () => {
    setLayerStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(id => {
        newStates[id] = { ...newStates[id], visible: true };
      });
      return newStates;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Layers Διαχείρισης</h3>
          <Badge variant="secondary" className="text-xs">
            {filteredProperties.length} στοιχεία
          </Badge>
        </div>

        {/* Search */}
        <Input
          placeholder="Αναζήτηση layer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 text-xs"
        />

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Τύπος" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλοι οι τύποι</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Κατάσταση" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλες</SelectItem>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {statusConfig[status].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs flex-1" onClick={handleShowAll}>
            <Eye className="h-3 w-3 mr-1" />
            Εμφάνιση Όλων
          </Button>
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs flex-1" onClick={handleHideAll}>
            <EyeOff className="h-3 w-3 mr-1" />
            Απόκρυψη Όλων
          </Button>
        </div>
      </div>

      {/* Properties List */}
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
                layerState={layerStates[property.id] || { visible: true, locked: false, opacity: 0.7 }}
                onSelect={() => onPolygonSelect(property.id)}
                onToggleVisibility={() => handleToggleVisibility(property.id)}
                onToggleLock={() => handleToggleLock(property.id)}
                onOpacityChange={(opacity) => handleOpacityChange(property.id, opacity)}
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
