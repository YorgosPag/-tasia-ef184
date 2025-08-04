"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home } from 'lucide-react';
import { PropertySaleInfo } from './PropertySaleInfo';
import { PropertyStorageTable } from './PropertyStorageTable';
import type { Property } from '@/types/property';
import { PROPERTY_TYPE_LABELS } from '@/types/property';

interface PropertyGeneralTabProps {
  property: Property;
  isEditing: boolean;
}

export function PropertyGeneralTab({ property, isEditing }: PropertyGeneralTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Στοιχεία Ακινήτου
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Τύπος Ακινήτου</Label>
              <Select defaultValue={property.type} disabled={!isEditing}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Κωδικός</Label>
              <Input defaultValue={property.code} className="h-10" disabled={!isEditing} />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Προσανατολισμός</Label>
              <Select defaultValue={property.orientation} disabled={!isEditing}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">Βόρεια</SelectItem>
                  <SelectItem value="south">Νότια</SelectItem>
                  <SelectItem value="east">Ανατολικά</SelectItem>
                  <SelectItem value="west">Δυτικά</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Αριθμός Επιπέδων</Label>
              <Input type="number" defaultValue="1" className="h-10" disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Πλήθος Δωματίων</Label>
              <Input type="number" defaultValue={property.rooms} className="h-10" disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Πλήθος Λουτρών</Label>
              <Input type="number" defaultValue={property.bathrooms} className="h-10" disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Πλήθος Αποθηκών</Label>
              <Input type="number" defaultValue="0" className="h-10" disabled={!isEditing} />
            </div>
          </div>
        </CardContent>
      </Card>

      <PropertyStorageTable storageUnits={property.storageUnits} />

      {property.status === 'sold' && (
        <PropertySaleInfo property={property} isEditing={isEditing} />
      )}
    </div>
  );
}
