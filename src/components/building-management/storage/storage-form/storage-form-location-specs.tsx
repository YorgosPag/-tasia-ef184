'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePriceCalculation } from './storage-form-hooks';
import { StorageUnit } from '@/types/storage';
import { availableFloors } from './storage-form-utils';

interface StorageFormLocationSpecsProps {
  formData: Partial<StorageUnit>;
  errors: { [key: string]: string };
  updateField: (field: keyof StorageUnit, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<Partial<StorageUnit>>>;
  isEditing: boolean;
}

export function StorageFormLocationSpecs({
  formData,
  errors,
  updateField,
  setFormData,
  isEditing,
}: StorageFormLocationSpecsProps) {
  const { isCalculatingPrice } = usePriceCalculation(formData, setFormData, isEditing);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Τοποθεσία & Προδιαγραφές
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Όροφος *</Label>
            <select
              value={formData.floor}
              onChange={(e) => updateField('floor', e.target.value)}
              className="h-10 w-full px-3 rounded-md border border-input bg-background dark:bg-gray-700 text-sm"
            >
              {availableFloors.map(floor => (
                <option key={floor} value={floor}>{floor}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Επιφάνεια (m²) *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.area || ''}
              onChange={(e) => updateField('area', parseFloat(e.target.value) || 0)}
              className={cn(errors.area && "border-red-500")}
              placeholder="0.00"
            />
            {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
          </div>

          <div className="space-y-2">
            <Label>Τιμή (€) *</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                className={cn(errors.price && "border-red-500")}
                placeholder="0.00"
              />
              {isCalculatingPrice && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            {formData.area && formData.price && formData.area > 0 && (
              <p className="text-xs text-gray-500">
                {Math.round(formData.price / formData.area).toLocaleString('el-GR')} €/m²
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Συνδεδεμένο Ακίνητο</Label>
            <Input
              value={formData.linkedProperty || ''}
              onChange={(e) => updateField('linkedProperty', e.target.value || null)}
              placeholder="π.χ. Δ2.1"
            />
            <p className="text-xs text-gray-500">
              Κωδικός ακινήτου που συνοδεύει αυτή τη μονάδα
            </p>
          </div>

          <div className="space-y-2">
            <Label>Συντεταγμένες (X, Y)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={formData.coordinates?.x || ''}
                onChange={(e) => updateField('coordinates', {
                  ...formData.coordinates,
                  x: parseFloat(e.target.value) || 0
                })}
                placeholder="X"
              />
              <Input
                type="number"
                value={formData.coordinates?.y || ''}
                onChange={(e) => updateField('coordinates', {
                  ...formData.coordinates,
                  y: parseFloat(e.target.value) || 0
                })}
                placeholder="Y"
              />
            </div>
            <p className="text-xs text-gray-500">
              Θέση στον χάρτη του κτιρίου
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
