"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Ruler, 
  Euro,
  Edit,
  Save,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property } from '@/types/property';
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, PROPERTY_STATUS_COLORS } from '@/types/property';
import { formatCurrency } from '@/lib/project-helpers.tsx';

interface PropertyDetailsHeaderProps {
  property: Property;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export function PropertyDetailsHeader({ property, isEditing, setIsEditing }: PropertyDetailsHeaderProps) {
  return (
    <div className="p-4 border-b bg-background/50 backdrop-blur-sm rounded-t-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">{property.code}</h2>
            <Badge className={cn("text-xs", PROPERTY_STATUS_COLORS[property.status])}>
              {PROPERTY_STATUS_LABELS[property.status]}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {PROPERTY_TYPE_LABELS[property.type]} - Όροφος {property.floor}
          </p>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              <span>{property.area} m²</span>
            </div>
            <div className="flex items-center gap-1">
              <Euro className="w-4 h-4" />
              <span>{formatCurrency(property.price)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <Save className="w-4 h-4 mr-2" />
                Αποθήκευση
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Ακύρωση
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Επεξεργασία
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
