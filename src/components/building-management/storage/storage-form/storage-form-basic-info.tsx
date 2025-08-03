'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StorageUnit, StorageType, StorageStatus } from '@/types/storage';

interface StorageFormBasicInfoProps {
  formData: Partial<StorageUnit>;
  errors: { [key: string]: string };
  updateField: (field: keyof StorageUnit, value: any) => void;
  onGenerateAutoCode: () => void;
}

export function StorageFormBasicInfo({
  formData,
  errors,
  updateField,
  onGenerateAutoCode,
}: StorageFormBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Βασικές Πληροφορίες
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Κωδικός *</Label>
            <div className="flex gap-2">
              <Input
                value={formData.code || ''}
                onChange={(e) => updateField('code', e.target.value)}
                className={cn(errors.code && "border-red-500")}
                placeholder="π.χ. A_B01"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={onGenerateAutoCode}
              >
                Auto
              </Button>
            </div>
            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
          </div>

          <div className="space-y-2">
            <Label>Τύπος *</Label>
            <select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="h-10 w-full px-3 rounded-md border border-input bg-background dark:bg-gray-700 text-sm"
            >
              <option value="storage">Αποθήκη</option>
              <option value="parking">Θέση Στάθμευσης</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Κατάσταση *</Label>
            <select
              value={formData.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="h-10 w-full px-3 rounded-md border border-input bg-background dark:bg-gray-700 text-sm"
            >
              <option value="available">Διαθέσιμο</option>
              <option value="sold">Πωλήθηκε</option>
              <option value="reserved">Κρατημένο</option>
              <option value="maintenance">Συντήρηση</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Περιγραφή *</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            className={cn(errors.description && "border-red-500")}
            placeholder="Περιγραφή της μονάδας..."
            rows={2}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
