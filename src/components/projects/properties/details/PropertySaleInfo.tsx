"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import type { Property } from '@/types/property';
import { PROPERTY_STATUS_LABELS } from '@/types/property';

interface PropertySaleInfoProps {
  property: Property;
  isEditing: boolean;
}

export function PropertySaleInfo({ property, isEditing }: PropertySaleInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Στοιχεία Πώλησης
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Αγοραστής</Label>
            <Input defaultValue={property.buyer || ""} className="h-10" disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Κατάσταση</Label>
            <Select defaultValue={property.status} disabled={!isEditing}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROPERTY_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Προεσδοκιμένη Τιμή Πώλησης</Label>
            <Input type="number" step="0.01" defaultValue="100000.00" className="h-10" disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Αντικειμενική Αξία</Label>
            <Input type="number" step="0.01" defaultValue="0.00" className="h-10" disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Προεσδοκιμένη Τιμή Παρακολουθημάτων</Label>
            <Input type="number" step="0.01" defaultValue="4490.00" className="h-10" disabled={!isEditing} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
