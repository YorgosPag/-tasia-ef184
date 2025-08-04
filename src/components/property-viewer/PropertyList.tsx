"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Home, Building, MapPin, Euro, Ruler } from "lucide-react";

interface Property {
  id: string;
  name: string;
  type: string;
  building: string;
  floor: number;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
  price?: number;
  area?: number;
  project: string;
  description?: string;
}

interface PropertyListProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onSelectProperty: (propertyId: string) => void;
  isLoading: boolean;
}

const statusConfig = {
  'for-sale': {
    label: 'Προς Πώληση',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  'for-rent': {
    label: 'Προς Ενοικίαση',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  'sold': {
    label: 'Πουλημένο',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
  'rented': {
    label: 'Ενοικιασμένο',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  'reserved': {
    label: 'Δεσμευμένο',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
};

const propertyTypeIcons = {
  'Στούντιο': Home,
  'Γκαρσονιέρα': Home,
  'Διαμέρισμα 2Δ': Home,
  'Διαμέρισμα 3Δ': Home,
  'Μεζονέτα': Building,
  'Κατάστημα': Building,
};

function PropertyListSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-3 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function PropertyListItem({ 
  property, 
  isSelected, 
  onSelect 
}: { 
  property: Property; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  const statusInfo = statusConfig[property.status];
  const IconComponent = propertyTypeIcons[property.type as keyof typeof propertyTypeIcons] || Home;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border",
        isSelected 
          ? "ring-2 ring-primary border-primary shadow-md" 
          : "hover:border-primary/50"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <h4 className="font-medium text-sm truncate">{property.name}</h4>
          </div>
          <Badge 
            variant="outline" 
            className={cn("text-xs flex-shrink-0", statusInfo.color)}
          >
            {statusInfo.label}
          </Badge>
        </div>

        {/* Type */}
        <p className="text-xs text-muted-foreground">{property.type}</p>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{property.building}</span>
          <span>•</span>
          <span>{property.floor}ος όροφος</span>
        </div>

        {/* Price & Area */}
        <div className="flex items-center justify-between text-xs">
          {property.price && (
            <div className="flex items-center gap-1 text-green-600">
              <Euro className="h-3 w-3" />
              <span className="font-medium">
                {property.price.toLocaleString('el-GR')}€
              </span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Ruler className="h-3 w-3" />
              <span>{property.area}τμ</span>
            </div>
          )}
        </div>

        {/* Project */}
        <div className="pt-1 border-t">
          <span className="text-xs text-muted-foreground">{property.project}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function PropertyList({ 
  properties, 
  selectedPropertyId, 
  onSelectProperty, 
  isLoading 
}: PropertyListProps) {
  if (isLoading) {
    return <PropertyListSkeleton />;
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
        <Home className="h-8 w-8 mb-2" />
        <p className="text-sm">Δεν βρέθηκαν ακίνητα</p>
        <p className="text-xs">Δοκιμάστε να αλλάξετε τα φίλτρα</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-2">
        {properties.map((property) => (
          <PropertyListItem
            key={property.id}
            property={property}
            isSelected={selectedPropertyId === property.id}
            onSelect={() => onSelectProperty(property.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
