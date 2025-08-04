"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Home } from "lucide-react";
import { PropertyListItem } from "./PropertyListItem";
import { PropertyListSkeleton } from "./PropertyListSkeleton";


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
}

interface PropertyListProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onSelectProperty: (propertyId: string) => void;
  isLoading: boolean;
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Home className="h-8 w-8 mb-2" />
            <p className="text-sm">Δεν βρέθηκαν ακίνητα</p>
            <p className="text-xs">Δοκιμάστε να αλλάξετε τα φίλτρα</p>
        </div>
    )
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
    return <EmptyState />;
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
