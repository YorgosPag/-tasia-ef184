"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X, RotateCcw } from "lucide-react";

interface FilterState {
  project: string[];
  building: string[];
  floor: string[];
  propertyType: string[];
  status: string[];
  priceRange: { min: number | null; max: number | null };
  areaRange: { min: number | null; max: number | null };
}

export function PropertyViewerFilters() {
  const [filters, setFilters] = useState<FilterState>({
    project: [],
    building: [],
    floor: [],
    propertyType: [],
    status: [],
    priceRange: { min: null, max: null },
    areaRange: { min: null, max: null },
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Mock data - θα αντικατασταθεί με πραγματικά δεδομένα
  const mockProjects = ["Έργο Α", "Έργο Β", "Έργο Γ"];
  const mockBuildings = ["Κτίριο 1", "Κτίριο 2", "Κτίριο 3"];
  const mockFloors = ["Υπόγειο", "Ισόγειο", "1ος Όροφος", "2ος Όροφος"];
  const mockPropertyTypes = ["Στούντιο", "Γκαρσονιέρα", "Διαμέρισμα 2Δ", "Διαμέρισμα 3Δ", "Μεζονέτα", "Κατάστημα"];
  const mockStatuses = ["Προς Πώληση", "Προς Ενοικίαση", "Πουλημένο", "Ενοικιασμένο", "Δεσμευμένο"];

  const statusColors = {
    "Προς Πώληση": "bg-green-100 text-green-800 border-green-200",
    "Προς Ενοικίαση": "bg-blue-100 text-blue-800 border-blue-200",
    "Πουλημένο": "bg-red-100 text-red-800 border-red-200",
    "Ενοικιασμένο": "bg-orange-100 text-orange-800 border-orange-200",
    "Δεσμευμένο": "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

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

  const clearFilter = (filterType: keyof FilterState, value?: string) => {
    setFilters(prev => {
      if (value) {
        const currentArray = prev[filterType] as string[];
        return {
          ...prev,
          [filterType]: currentArray.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: Array.isArray(prev[filterType]) ? [] : { min: null, max: null }
        };
      }
    });
  };

  const clearAllFilters = () => {
    setFilters({
      project: [],
      building: [],
      floor: [],
      propertyType: [],
      status: [],
      priceRange: { min: null, max: null },
      areaRange: { min: null, max: null },
    });
    setActiveFiltersCount(0);
  };

  const getActiveFilters = () => {
    const active = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        active.push(...value.map(v => ({ type: key, value: v })));
      }
    });
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Φίλτρα Αναζήτησης</CardTitle>
          <div className="flex items-center gap-2">
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilters.length} ενεργά
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Καθαρισμός
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Ενεργά Φίλτρα:</Label>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`text-xs ${filter.type === 'status' ? statusColors[filter.value as keyof typeof statusColors] : ''}`}
                >
                  {filter.value}
                  <button
                    onClick={() => clearFilter(filter.type as keyof FilterState, filter.value)}
                    className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Separator />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Έργο */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Έργο</Label>
            <div className="space-y-2">
              {mockProjects.map((project) => (
                <div key={project} className="flex items-center space-x-2">
                  <Checkbox
                    id={`project-${project}`}
                    checked={filters.project.includes(project)}
                    onCheckedChange={(checked) => 
                      handleMultiSelectChange('project', project, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`project-${project}`} 
                    className="text-sm cursor-pointer"
                  >
                    {project}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Κτίριο */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Κτίριο</Label>
            <div className="space-y-2">
              {mockBuildings.map((building) => (
                <div key={building} className="flex items-center space-x-2">
                  <Checkbox
                    id={`building-${building}`}
                    checked={filters.building.includes(building)}
                    onCheckedChange={(checked) => 
                      handleMultiSelectChange('building', building, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`building-${building}`} 
                    className="text-sm cursor-pointer"
                  >
                    {building}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Όροφος */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Όροφος</Label>
            <div className="space-y-2">
              {mockFloors.map((floor) => (
                <div key={floor} className="flex items-center space-x-2">
                  <Checkbox
                    id={`floor-${floor}`}
                    checked={filters.floor.includes(floor)}
                    onCheckedChange={(checked) => 
                      handleMultiSelectChange('floor', floor, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`floor-${floor}`} 
                    className="text-sm cursor-pointer"
                  >
                    {floor}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Τύπος Ακινήτου */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Τύπος</Label>
            <div className="space-y-2">
              {mockPropertyTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.propertyType.includes(type)}
                    onCheckedChange={(checked) => 
                      handleMultiSelectChange('propertyType', type, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`type-${type}`} 
                    className="text-sm cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Κατάσταση */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Κατάσταση</Label>
            <div className="space-y-2">
              {mockStatuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onCheckedChange={(checked) => 
                      handleMultiSelectChange('status', status, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`status-${status}`} 
                    className="text-sm cursor-pointer"
                  >
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${statusColors[status as keyof typeof statusColors]}`}
                    >
                      {status}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Ταξινόμηση */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Ταξινόμηση</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Επιλέξτε..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Όνομα (Α-Ω)</SelectItem>
                <SelectItem value="name-desc">Όνομα (Ω-Α)</SelectItem>
                <SelectItem value="price-asc">Τιμή (Χαμηλή-Υψηλή)</SelectItem>
                <SelectItem value="price-desc">Τιμή (Υψηλή-Χαμηλή)</SelectItem>
                <SelectItem value="area-asc">Εμβαδόν (Μικρό-Μεγάλο)</SelectItem>
                <SelectItem value="area-desc">Εμβαδόν (Μεγάλο-Μικρό)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
